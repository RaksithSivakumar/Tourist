import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: { translation: { appName: 'Smart Tourist Safety', panic: 'Panic', safetyScore: 'Safety Score' } },
  hi: { translation: { appName: 'स्मार्ट पर्यटक सुरक्षा', panic: 'आपातकाल', safetyScore: 'सुरक्षा स्कोर' } },
  bn: { translation: { appName: 'স্মার্ট পর্যটক নিরাপত্তা', panic: 'জরুরি', safetyScore: 'নিরাপত্তা স্কোর' } },
  te: { translation: { appName: 'స్మార్ట్ పర్యాటక భద్రత', panic: 'అత్యవసరం', safetyScore: 'భద్రత స్కోరు' } },
  ta: { translation: { appName: 'ஸ்மார்ட் சுற்றுலா பாதுகாப்பு', panic: 'அவசரம்', safetyScore: 'பாதுகாப்பு மதிப்பெண்' } },
  gu: { translation: { appName: 'સ્માર્ટ પર્યટક સુરક્ષા', panic: 'આપત્કાળ', safetyScore: 'સુરક્ષા સ્કોર' } },
  mr: { translation: { appName: 'स्मार्ट पर्यटक सुरक्षा', panic: 'आपत्काल', safetyScore: 'सुरक्षा गुण' } },
  kn: { translation: { appName: 'ಸ್ಮಾರ್ಟ್ ಪ್ರವಾಸಿಗರ ಭದ್ರತೆ', panic: 'ತುರ್ತು', safetyScore: 'ಭದ್ರತಾ ಅಂಕ' } },
  ml: { translation: { appName: 'സ്മാർട്ട് ടൂറിസ്റ്റ് സുരക്ഷ', panic: 'അടിയന്തിരം', safetyScore: 'സുരക്ഷാ സ്കോർ' } },
  or: { translation: { appName: 'ସ୍ମାର୍ଟ ପର୍ଯ୍ୟଟକ ସୁରକ୍ଷା', panic: 'ଜରୁରୀ', safetyScore: 'ସୁରକ୍ଷା ସ୍କୋର' } },
  as: { translation: { appName: 'স্মাৰ্ট পৰ্যটক সুৰক্ষা', panic: 'জৰুৰী', safetyScore: 'সুৰক্ষা স্ক’ৰ' } },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;


