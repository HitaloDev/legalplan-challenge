export const FormattedDate = (timestamp: number) => {
  const today = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  let formattedDate = today.toLocaleDateString('pt-BR', options);

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1).toLowerCase();
};
