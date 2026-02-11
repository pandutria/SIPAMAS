import Swal, { type SweetAlertIcon } from 'sweetalert2';

interface SwalMessageProps {
    title: string;
    text?: string;
    type?: SweetAlertIcon;
    confirmText?: string;
    cancelText?: string;
    timer?: number;
    showConfirmButton?: boolean;
    showCancelButton?: boolean;
}

export const SwalMessage = ({
    title,
    text = '',
    type = 'success',
    confirmText = 'OK',
    cancelText = 'Tidak',
    timer,
    showConfirmButton = true,
    showCancelButton = false,
}: SwalMessageProps) => {
    return Swal.fire({
        icon: type,
        title,
        text,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        showConfirmButton,
        showCancelButton,
        timer,
        timerProgressBar: !!timer,
        allowOutsideClick: false,
        allowEscapeKey: true,
        confirmButtonColor:
            type === 'success'
                ? '#16a34a'
                : type === 'error'
                ? '#dc2626'
                : '#f60',
        cancelButtonColor: '#6b7280',
        showClass: {
            popup: 'swal2-show',
        },
        hideClass: {
            popup: 'swal2-hide',
        },
    });
};
