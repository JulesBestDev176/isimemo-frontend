import { useRef } from "react";

interface PdfViewerProps {
  documentActif: string;
}

const PdfViewer = ({ documentActif }: PdfViewerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="relative">
      {/* Conteneur principal */}
      <div className="aspect-[16/9] min-h-[500px] bg-white rounded-lg overflow-hidden">
        {/* Iframe pour afficher le PDF avec les contrôles natifs */}
        <iframe
          ref={iframeRef}
          src={`${documentActif}#toolbar=1&navpanes=1&scrollbar=1`}
          className="w-full h-full"
          title="PDF Viewer"
          style={{ border: 'none' }}
        />

        {/* Filigrane en superposition */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 10 }}
        >
          <div className="text-5xl font-bold text-primary opacity-10 rotate-45 select-none">
            ISIMemo - Consultation uniquement
          </div>
        </div>
      </div>

      {/* Barre d'information */}
      

      {/* Style global pour empêcher l'impression */}
      <style>{`
        @media print {
          body { display: none; }
        }
      `}</style>
    </div>
  );
};

export default PdfViewer;
