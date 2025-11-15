export interface BrowserTab {
	id: string;
	title: string;
	url: string;
	pageId?: string; // WebSocket page ID for backend communication
}

