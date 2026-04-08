// src/components/UI/FormElements.jsx
export const DashboardSelect = ({ options, value, onChange, defaultLabel }) => {
  return (
    <select className="custom-select" value={value} onChange={onChange}>
      {defaultLabel && <option value="All">{defaultLabel}</option>}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
};
