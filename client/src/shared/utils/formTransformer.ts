export const toFormData = (form: any) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(form)) {
    if (key === 'files') {
      for (let file of form['files']) {
        formData.append(key, file);
      }
      continue;
    }
    if (key === 'exercises') {
      formData.append(key, JSON.stringify(value))
      continue;
    }
    formData.append(key, value as File | string);
  }

  return formData;
}
