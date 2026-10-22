import { ErrorHandler, Injectable } from '@angular/core';

/**
 * Handles lazy-loaded chunk 404 errors that occur after a new Netlify deploy.
 * When Angular tries to load a chunk that no longer exists (because the build
 * changed the hash), this handler detects the failure and forces a hard reload
 * so the user gets the latest build automatically.
 */
@Injectable()
export class ChunkErrorHandler implements ErrorHandler {
  private reloadAttempted = false;

  handleError(error: any): void {
    const chunkFailedMessage =
      /Loading chunk [\d]+ failed|Failed to fetch dynamically imported module|dynamically imported module/i;

    if (chunkFailedMessage.test(error?.message ?? '') && !this.reloadAttempted) {
      this.reloadAttempted = true;
      console.warn('[ChunkErrorHandler] Stale chunk detected — reloading page for latest build.');
      window.location.reload();
      return;
    }

    // For all other errors, log normally
    console.error(error);
  }
}
