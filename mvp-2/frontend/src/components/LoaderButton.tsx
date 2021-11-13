import React from "react";

type Props = {
  isLoading: boolean;
  text: string;
  loadingText: string;
  className: string;
  disabled: boolean;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function LoaderButton({
  isLoading,
  text,
  loadingText,
  className,
  disabled = false,
  ...props
}: Props) {
  return (
    <button className={className} disabled={disabled || isLoading} {...props}>
      {isLoading ? loadingText : text}
    </button>
  );
}
