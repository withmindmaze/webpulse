import { toast } from 'react-toastify';
export const isValidURL = (url) => {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(url);
}

export const isURLAccessible = async (url) => {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            mode: 'no-cors'
        });
        return true;
    } catch (error) {
        return false;
    }
}
// Function to validate URL before proceeding
export const validateURL = async (url) => {
    if (!isValidURL(url)) {
        toast.error("Please enter a valid URL.");
        return false;
    } else if (!await isURLAccessible(url)) {
        toast.error("URL is not accessible. Please check the URL and try again.");
        return false;
    }
    return true;
}
