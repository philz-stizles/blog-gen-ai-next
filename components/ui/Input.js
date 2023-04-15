import React from "react";

const Input = ({ label, value, onChange, type }) => {
  return (
    <div>
      {label && (
        <label>
          <strong>{label}:</strong>
        </label>
      )}
      <textarea
        className="resize-none block w-full border border-slate-500 mt-2 mb-4 p-2"
        value={value}
        onChange={onChange}
      ></textarea>
    </div>
  );
};

export default Input;
