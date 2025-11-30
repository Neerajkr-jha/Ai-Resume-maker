import MinimalImageTemplate from "../assets/templates/MinimalImageTemplate";
import MinimalTemplate from "../assets/templates/MinimalTemplate";
import ModernTemplate from "../assets/templates/ModernTemplate";
import ClassicTemplate from "../assets/templates/ClassicTemplate";

function ResumePreview({ data, template, accentColor, classes = "" }) {
  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} accentColor={accentColor} />;
      case "minimal-image":
        return <MinimalImageTemplate data={data} accentColor={accentColor} />;
      case "minimal":
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      default:
        return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  };

  return (
    <div className="w-full bg-gray-100">
      <div
        id="resume-preview"
        className={`bg-white border border-gray-200 print:w-[8.5in] print:min-h-[11in] print:shadow-none print:border-none ${classes}`}
      >
        {renderTemplate()}
      </div>
      <style>
        {`
          @page {
            size: letter;
            margin: 0;
          }
          @media print {
            html, body {
              width: 8.5in;
              height: 11in;
              overflow: hidden;
            }
            body * {
              visibility: hidden;
            }
            #resume-preview,
            #resume-preview * {
              visibility: visible;
            }
            #resume-preview {
              position: fixed !important;
              inset: 0 !important; /* replaces left:0, top:0 */
              width: 8.5in !important;
              min-height: 11in !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default ResumePreview;
