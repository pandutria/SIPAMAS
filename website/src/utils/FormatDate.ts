export function FormatDate(dateString: string): string {
    if (!dateString) return '-';

    const date = new Date(dateString);

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(date);
}
