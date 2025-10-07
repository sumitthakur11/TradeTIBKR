export const DownloadCSVFromJSON = (data, filename = "data.csv") => {
  if (!data || data.length === 0) {
    alert("No data available to download!");
    return;
  }

  const headers = Object.keys(data[0]);

  const csvRows = [
    headers.join(","), // Header row
    ...data.map((row) =>
      headers.map((field) => JSON.stringify(row[field] ?? "")).join(",")
    ),
  ];

  const csvContent = csvRows.join("\n");

  // Create a blob and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};
