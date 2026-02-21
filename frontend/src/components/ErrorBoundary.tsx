import React from "react";

interface State {
  hasError: boolean;
  error?: Error | null;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  State
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // You can log the error to an external service here
    // console.error('ErrorBoundary caught error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-xl text-center">
            <h1 className="text-4xl font-bold mb-4">Có lỗi xảy ra</h1>
            <p className="mb-4">
              Ứng dụng gặp sự cố khi hiển thị trang. Vui lòng thử tải lại hoặc
              liên hệ quản trị viên.
            </p>
            <pre className="text-xs p-4 bg-base-200 rounded-md text-left overflow-auto">
              {this.state.error?.message}
            </pre>
            <div className="mt-4">
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Tải lại trang
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
