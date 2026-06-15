declare module "react-katex" {
  import * as React from "react";

  export interface MathComponentProps {
    math: string;
    block?: boolean;
    errorColor?: string;
    renderError?: (error: Error) => React.ReactNode;
    settings?: Record<string, unknown>;
  }

  export const InlineMath: React.FC<MathComponentProps>;
  export const BlockMath: React.FC<MathComponentProps>;
}
