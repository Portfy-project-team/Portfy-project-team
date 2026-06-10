// Mock complet de @react-pdf/renderer pour les tests
// Ce module utilise du JSX et des dépendances natives qui ne fonctionnent pas dans Jest
// On remplace tout par des fonctions no-op

export const Document       = () => null;
export const Page           = () => null;
export const View           = () => null;
export const Text           = () => null;
export const Image          = () => null;
export const StyleSheet     = { create: (styles: any) => styles };
export const renderToBuffer = async () => Buffer.from("mock-pdf-content");
export const Font           = { register: () => {} };
export const PDFViewer      = () => null;
export const BlobProvider   = () => null;
export const pdf            = () => ({ toBuffer: async () => Buffer.from("mock-pdf") });