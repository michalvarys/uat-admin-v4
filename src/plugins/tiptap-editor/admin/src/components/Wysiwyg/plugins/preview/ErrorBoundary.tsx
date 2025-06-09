import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // You can also log the error to an error reporting service
        console.error("Error in component:", error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    render(): ReactNode {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="error-boundary">
                    <h2>Chyba při vykreslování obsahu</h2>
                    <details>
                        <summary>Zobrazit detaily chyby</summary>
                        <p>{this.state.error?.toString()}</p>
                        <pre>{this.state.errorInfo?.componentStack}</pre>
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
