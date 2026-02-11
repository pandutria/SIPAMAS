import Swal from 'sweetalert2';

interface SwalLoadingOptions {
  title?: string;
}

const SwalLoading = (options?: SwalLoadingOptions) => {
  Swal.fire({
    title: options?.title ?? 'Memuat...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeSwalLoading = () => {
  Swal.close();
};

export default SwalLoading;
