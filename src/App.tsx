import { useState, ChangeEvent } from "react";
import jsPDF from "jspdf";

export default function FlipDealAnalyzer() {
  const [values, setValues] = useState({
    purchasePrice: 0,
    renoCosts: 0,
    closingCosts: 0,
    holdingCosts: 0,
    sellingCosts: 0,
    miscCosts: 0,
    resalePrice: 0,
    desiredProfitMargin: 25,
    loanAmount: 0,
    interestRate: 0,
    loanTermMonths: 0,
    rentalIncome: 0,
    holdMonths: 0
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: parseFloat(e.target.value) || 0
    });
  };

  const {
    purchasePrice,
    renoCosts,
    closingCosts,
    holdingCosts,
    sellingCosts,
    miscCosts,
    resalePrice,
    desiredProfitMargin,
    loanAmount,
    interestRate,
    loanTermMonths,
    rentalIncome,
    holdMonths
  } = values;

  const totalInvestment = purchasePrice + renoCosts + closingCosts + holdingCosts + sellingCosts + miscCosts;
  const targetResalePrice = totalInvestment * (1 + desiredProfitMargin / 100);
  const profit = resalePrice - totalInvestment;
  const profitMargin = (profit / totalInvestment) * 100;
  const isDealGood = profitMargin >= desiredProfitMargin;
  const monthlyInterest = interestRate / 100 / 12;
  const financingCost = loanAmount > 0 && interestRate > 0 && loanTermMonths > 0
    ? loanAmount * monthlyInterest * loanTermMonths
    : 0;
  const netRentalIncome = rentalIncome * holdMonths;
  const roi = ((profit + netRentalIncome - financingCost) / totalInvestment * 100).toFixed(2);

  const exportToPDF = () => {
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(16);
    doc.text("Flip Deal Analysis Summary", 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Total Investment: $${totalInvestment.toLocaleString()}`, 10, y += 10);
    doc.text(`Target Resale Price: $${targetResalePrice.toLocaleString()}`, 10, y += 10);
    doc.text(`Estimated Profit: $${profit.toLocaleString()}`, 10, y += 10);
    doc.text(`Profit Margin: ${profitMargin.toFixed(2)}%`, 10, y += 10);
    doc.text(`Financing Cost: $${financingCost.toLocaleString()}`, 10, y += 10);
    doc.text(`Net Rental Income: $${netRentalIncome.toLocaleString()}`, 10, y += 10);
    doc.text(`ROI: ${roi}%`, 10, y += 10);
    doc.text(`${isDealGood ? "✅ Meets" : "❌ Does NOT meet"} profit target`, 10, y += 10);
    doc.save("flip-deal-analysis.pdf");
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>🛠️ Flip Deal Analyzer</h1>
      <div style={{
        display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "#ffffff",
        padding: "1.5rem", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", border: "1px solid #ddd"
      }}>
        <h2>🧾 Input Costs</h2>
        <input type="number" name="purchasePrice" placeholder="Purchase Price" onChange={handleChange} />
        <input type="number" name="renoCosts" placeholder="Renovation Costs" onChange={handleChange} />
        <input type="number" name="closingCosts" placeholder="Closing Costs" onChange={handleChange} />
        <input type="number" name="holdingCosts" placeholder="Holding Costs" onChange={handleChange} />
        <input type="number" name="sellingCosts" placeholder="Selling Costs" onChange={handleChange} />
        <input type="number" name="miscCosts" placeholder="Miscellaneous Costs" onChange={handleChange} />
        <h2>📈 Sale & Margin</h2>
        <input type="number" name="resalePrice" placeholder="Expected Resale Price" onChange={handleChange} />
        <input type="number" name="desiredProfitMargin" placeholder="Desired Profit Margin (%)" onChange={handleChange} value={desiredProfitMargin} />
        <h2>💸 Financing</h2>
        <input type="number" name="loanAmount" placeholder="Loan Amount" onChange={handleChange} />
        <input type="number" name="interestRate" placeholder="Interest Rate (%)" onChange={handleChange} />
        <input type="number" name="loanTermMonths" placeholder="Loan Term (months)" onChange={handleChange} />
        <h2>🏡 Rental Hold</h2>
        <input type="number" name="rentalIncome" placeholder="Monthly Rental Income" onChange={handleChange} />
        <input type="number" name="holdMonths" placeholder="Hold Period (months)" onChange={handleChange} />
      </div>
      <div style={{ backgroundColor: "#f5f5f5", padding: "1.5rem", marginTop: "2rem", borderRadius: "10px", border: "1px solid #ccc" }}>
        <h2>📊 Results</h2>
        <p><strong>Total Investment:</strong> ${totalInvestment.toLocaleString()}</p>
        <p><strong>Target Resale Price:</strong> ${targetResalePrice.toLocaleString()}</p>
        <p><strong>Estimated Profit:</strong> ${profit.toLocaleString()}</p>
        <p><strong>Profit Margin:</strong> {profitMargin.toFixed(2)}%</p>
        <p><strong>Financing Cost:</strong> ${financingCost.toLocaleString()}</p>
        <p><strong>Net Rental Income:</strong> ${netRentalIncome.toLocaleString()}</p>
        <p><strong>ROI:</strong> {roi}%</p>
        <p style={{ color: isDealGood ? "green" : "red", fontWeight: "bold", fontSize: "1.1rem" }}>
          {isDealGood ? "✅ Deal meets your profit margin!" : "❌ Deal does NOT meet your target margin."}
        </p>
        <button onClick={exportToPDF} style={{
          marginTop: "1.5rem", padding: "10px 20px", backgroundColor: "#4CAF50", color: "#fff",
          border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold"
        }}>
          📄 Download PDF
        </button>
      </div>
    </div>
  );
}
