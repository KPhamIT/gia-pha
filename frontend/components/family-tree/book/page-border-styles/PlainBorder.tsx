import type { PageBorderComponent } from "./types";

/** No decorative frame — clean paper. */
const PlainBorder: PageBorderComponent = ({ children }) => <>{children}</>;

export default PlainBorder;
