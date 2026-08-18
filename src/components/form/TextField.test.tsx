import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("associates the label with the input and reports typed changes", async () => {
    const handleChange = vi.fn();
    render(<TextField label="Pseudônimo" value="" onChange={handleChange} />);

    const input = screen.getByLabelText("Pseudônimo");
    await userEvent.type(input, "Rio");

    expect(handleChange).toHaveBeenCalledTimes(3);
    expect(handleChange).toHaveBeenLastCalledWith("o");
  });

  it("exposes an error message to assistive tech via aria-describedby", () => {
    render(<TextField label="E-mail" value="" onChange={() => {}} error="Informe um e-mail válido" />);

    const input = screen.getByLabelText("E-mail");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Informe um e-mail válido")).toBeInTheDocument();
  });
});
