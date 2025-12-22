/**
 * Base Transformer
 * 
 * Provides base class and utilities for data transformers.
 * Standardizes backend → frontend transformations.
 */

/**
 * Base transformer interface (for type checking)
 */
export interface ITransformer<TBackend, TFrontend> {
  /**
   * Transform backend data to frontend format
   */
  toFrontend(backend: TBackend): TFrontend;

  /**
   * Transform frontend data to backend format
   */
  toBackend(frontend: Partial<TFrontend>): Partial<TBackend>;

  /**
   * Transform array of backend data to frontend format
   */
  toFrontendArray(backendArray: TBackend[]): TFrontend[];
}

/**
 * Abstract base transformer class
 * Provides common transformation patterns
 */
export abstract class BaseTransformer<TBackend, TFrontend> implements ITransformer<TBackend, TFrontend> {
  /**
   * Transform backend data to frontend format
   * Must be implemented by subclasses
   */
  abstract toFrontend(backend: TBackend): TFrontend;

  /**
   * Transform frontend data to backend format
   * Must be implemented by subclasses
   */
  abstract toBackend(frontend: Partial<TFrontend>): Partial<TBackend>;

  /**
   * Transform array of backend data to frontend format
   */
  toFrontendArray(backendArray: TBackend[]): TFrontend[] {
    return backendArray.map(item => this.toFrontend(item));
  }

  /**
   * Handle paginated responses
   */
  transformPaginatedResponse(
    response: { results: TBackend[] } | TBackend[]
  ): TFrontend[] {
    if (Array.isArray(response)) {
      return this.toFrontendArray(response);
    }

    if (response && typeof response === 'object' && 'results' in response) {
      return this.toFrontendArray((response as { results: TBackend[] }).results);
    }

    return [];
  }
}

