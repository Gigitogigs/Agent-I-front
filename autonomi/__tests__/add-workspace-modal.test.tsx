import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AddWorkspaceModal } from "@/components/workspace/add-workspace-modal";
import { useCreateWorkspace } from "@/features/workspace/use-workspace";
import { useAuth } from "@/hooks/use-auth";

// Mock the hooks
jest.mock("@/features/workspace/use-workspace");
jest.mock("@/hooks/use-auth");

const mockUseCreateWorkspace = useCreateWorkspace as jest.MockedFunction<typeof useCreateWorkspace>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("AddWorkspaceModal", () => {
  let mutateAsyncMock: jest.Mock;
  let setActiveWorkspaceMock: jest.Mock;
  let onCloseMock: jest.Mock;

  beforeEach(() => {
    mutateAsyncMock = jest.fn();
    setActiveWorkspaceMock = jest.fn();
    onCloseMock = jest.fn();

    mockUseCreateWorkspace.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
      error: null,
    } as any);

    mockUseAuth.mockReturnValue({
      setActiveWorkspace: setActiveWorkspaceMock,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when open", () => {
    render(<AddWorkspaceModal open={true} onClose={onCloseMock} />);
    expect(screen.getByText("Add New Workspace")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Workspace name")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<AddWorkspaceModal open={false} onClose={onCloseMock} />);
    expect(screen.queryByText("Add New Workspace")).not.toBeInTheDocument();
  });

  it("submits the form and calls mutateAsync", async () => {
    mutateAsyncMock.mockResolvedValueOnce({ data: { id: "new-ws-id" } });
    render(<AddWorkspaceModal open={true} onClose={onCloseMock} />);

    const input = screen.getByPlaceholderText("Workspace name");
    fireEvent.change(input, { target: { value: "My Workspace" } });

    const submitBtn = screen.getByRole("button", { name: "Create Workspace" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith("My Workspace");
    });
    expect(setActiveWorkspaceMock).toHaveBeenCalledWith("new-ws-id");
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("displays error message if error exists", () => {
    mockUseCreateWorkspace.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
      error: new Error("Failed to create workspace"),
    } as any);

    render(<AddWorkspaceModal open={true} onClose={onCloseMock} />);
    expect(screen.getByText("Failed to create workspace")).toBeInTheDocument();
  });

  it("disables button while pending", () => {
    mockUseCreateWorkspace.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: true,
      error: null,
    } as any);

    render(<AddWorkspaceModal open={true} onClose={onCloseMock} />);
    const submitBtn = screen.getByRole("button"); // The Create Workspace button
    expect(submitBtn).toBeDisabled();
    expect(screen.getByText("Creating…")).toBeInTheDocument();
  });
});
