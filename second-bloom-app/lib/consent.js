import { getState } from "./repo";
import { PRIVACY_VERSION } from "./privacy";

// Muss die Person (noch einmal) zustimmen? Ja, wenn keine Einwilligung oder eine zu einer älteren Fassung vorliegt.
export async function needsConsent(userId) {
  return (await getState(userId))?.consent?.version !== PRIVACY_VERSION;
}
