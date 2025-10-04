export function TableStyles() {
  return (
    <style>{`
      .excel-scrollbar::-webkit-scrollbar {
        width: 16px;
        height: 16px;
      }
      .excel-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-left: 1px solid #cbd5e1;
        border-top: 1px solid #cbd5e1;
      }
      .excel-scrollbar::-webkit-scrollbar-thumb {
        background: #94a3b8;
        border: 3px solid #f1f5f9;
      }
      .excel-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #64748b;
      }
      .excel-scrollbar::-webkit-scrollbar-corner {
        background: #f1f5f9;
      }

      /* Remove focus outline from Switch */
      button[role="switch"],
      button[role="switch"]:focus,
      button[role="switch"]:focus-visible,
      button[role="switch"]:active {
        outline: none !important;
        box-shadow: none !important;
        border: none !important;
      }

      /* Remove Radix UI default focus styles */
      .rt-SwitchRoot:focus,
      .rt-SwitchRoot:focus-visible {
        outline: none !important;
        box-shadow: none !important;
      }
    `}</style>
  )
}
