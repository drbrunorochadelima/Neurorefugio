import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccessibleLineChart } from "./AccessibleLineChart";

describe("AccessibleLineChart", () => {
  const series = [
    {
      name: "Humor",
      color: "#2C5B66",
      points: [
        { label: "01/01", value: 3 },
        { label: "02/01", value: 4 },
      ],
    },
  ];

  it("renders an accessible svg with a title and description", () => {
    render(
      <AccessibleLineChart title="Histórico de humor" description="Evolução do humor ao longo do tempo" series={series} />,
    );

    const img = screen.getByRole("img", { name: /Histórico de humor/i });
    expect(img).toBeInTheDocument();
  });

  it("reveals a data table as a non-visual alternative when requested", async () => {
    render(<AccessibleLineChart title="Histórico de humor" description="desc" series={series} />);

    expect(screen.queryByRole("table")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Ver dados em tabela" }));

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    expect(screen.getByText("01/01")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("shows a fallback message instead of an empty chart when there is no data", () => {
    render(<AccessibleLineChart title="Vazio" description="desc" series={[]} />);
    expect(screen.getByText(/ainda não há dados suficientes/i)).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
