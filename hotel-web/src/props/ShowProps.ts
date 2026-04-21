export interface ItemList {
	id: number;
	name: string;
	description?: { primary: string; secondary: string };
}

export interface ListProps {
	items: ItemList[];
	onDelete: (item: number) => void;
	onEdit: (item: number) => void;
	onDownload?: (item: number) => void;
}

export interface MiTablaProps {
	rows: Object[];
	headers: Object;
	sumatoria?: string;
	onPermission?: (row: Object) => void;
	onDelete?: (row: Object, index: number) => void;
	onEdit?: (row: Object, index: number) => void;
	onDownload?: (row: Object) => void;
}

export interface TableProps {
	rows: Object[];
	headers: string[];
	hide: string[];
	sumatoria: string;
	onDelete: (row: Object) => void;
	onEdit: (row: Object) => void;
	onDownload: (row: Object) => void;
}

export interface ToolbarProps {
	title: string;
	onSearch?: (value: string) => void;
	onCreate?: () => void;
	onUpload?: () => void;
	onDownload?: () => void;
}
