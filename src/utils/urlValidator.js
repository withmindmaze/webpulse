import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const isValidURL = (url) => {
    const pattern = new RegExp(
        '^(https?:\\/\\/)' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i' // fragment locator
    );
    return pattern.test(url);
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
        if (localStorage.getItem('language') === 'ar') {
            toast.error("أدخل رابط صحيح من فضلك");
        } else {
            toast.error("Please enter a valid URL.");
        }
        return false;
    } else if (!await isURLAccessible(url)) {
        if (localStorage.getItem('language') === 'ar') {
            toast.error("لا يمكن الوصول إلى الموقع. يرجى التحقق من العنوان ثم حاول مرة أخرى.");
        } else {
            toast.error("URL is not accessible. Please check the URL and try again.");
        }
        return false;
    }
    return true;
}

export const isValidEmail = (email) => {
    const pattern = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$');
    if (!pattern.test(email)) {
        const language = localStorage.getItem('language');
        if (language === 'ar') {
            toast.error("الرجاء إدخال بريد إلكتروني صحيح.");
        } else {
            toast.error("Please enter a valid email address.");
        }
        return false;
    }
    return true;
}

export const isValidPassword = (password) => {
    console.log(password);
    const pattern = /^(?=.*[A-Za-z])(?=.*\d).*$/;
    return pattern.test(password);
};
