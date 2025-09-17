import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation & Header
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.gallery': 'Gallery',
    'nav.lessons': 'Lessons',
    'nav.videos': 'Videos',
    'nav.signOut': 'Sign Out',
    'nav.language': 'عربي',
    'nav.login': 'Login',
    
    // Home Page
    'home.title': 'Welcome to Art Studio',
    'home.subtitle': 'Explore your creativity',
    'home.featured': 'Featured Artworks',
    'home.recentLessons': 'Recent Lessons',
    'home.recentVideos': 'Recent Videos',
    'home.startLearning': 'Start Learning',
    'home.viewAll': 'View All',
    'home.viewGallery': 'View Gallery',
    
    // About Page
    'about.title': 'About the Artist',
    'about.biography': 'Biography',
    'about.achievements': 'Achievements',
    'about.education': 'Education',
    'about.exhibitions': 'Exhibitions',
    
    // Gallery Page
    'gallery.title': 'Art Gallery',
    'gallery.search': 'Search artworks...',
    'gallery.all': 'All',
    'gallery.filter': 'Filter',
    'gallery.sortBy': 'Sort by',
    'gallery.year': 'Year',
    'gallery.title_sort': 'Title',
    'gallery.price': 'Price',
    'gallery.share': 'Share',
    'gallery.download': 'Download',
    'gallery.close': 'Close',
    'gallery.noResults': 'No artworks found',
    
    // Lessons Page
    'lessons.title': 'Art Lessons',
    'lessons.subtitle': 'Learn step by step',
    'lessons.startLesson': 'Start Lesson',
    'lessons.continue': 'Continue',
    'lessons.review': 'Review',
    'lessons.completed': 'Completed',
    'lessons.minutes': 'minutes',
    'lessons.beginner': 'Beginner',
    'lessons.intermediate': 'Intermediate',
    'lessons.advanced': 'Advanced',
    'lessons.progress': 'Progress',
    'lessons.modules': 'modules',
    'lessons.duration': 'Duration',
    'lessons.learningProgress': 'Your Learning Progress',
    'lessons.inProgress': 'In Progress',
    'lessons.available': 'Available',
    'lessons.start': 'Start',
    'lessons.moduleCompleted': 'Module Completed!',
    'lessons.moduleCompletedDesc': 'Great job! Keep up the excellent progress.',
    
    // Videos Page
    'videos.title': 'Video Tutorials',
    'videos.gallery': 'Video Gallery',
    'videos.views': 'views',
    'videos.loading': 'Loading videos...',
    'videos.noVideos': 'No videos available yet.',
    'videos.general': 'General',
    
    // Auth Page
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.signingIn': 'Signing in...',
    'auth.signingUp': 'Signing up...',
    'auth.forgotPassword': 'Forgot your password?',
    'auth.sending': 'Sending...',
    
    // Admin Pages
    'admin.title': 'Admin Panel',
    'admin.artworks': 'Manage Artworks',
    'admin.lessons': 'Manage Lessons',
    'admin.videos': 'Manage Videos',
    'admin.profile': 'Manage Profile',
    'admin.addArtwork': 'Add Artwork',
    'admin.addLesson': 'Add Lesson',
    'admin.addVideo': 'Add Video',
    'admin.artistProfile': 'Artist Profile',
    'admin.title_field': 'Title',
    'admin.description': 'Description',
    'admin.save': 'Save',
    'admin.cancel': 'Cancel',
    'admin.edit': 'Edit',
    'admin.delete': 'Delete',
    'admin.add': 'Add',
    'admin.upload': 'Upload',
    'admin.featured': 'Featured',
    'admin.published': 'Published',
    'admin.available': 'Available',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.notFound': 'Page Not Found',
    'common.notFoundMessage': 'The page you are looking for does not exist.',
    'common.returnHome': 'Return to Home',
  },
  ar: {
    // Navigation & Header
    'nav.home': 'الرئيسية',
    'nav.about': 'حول الفنان',
    'nav.gallery': 'المعرض',
    'nav.lessons': 'الدروس',
    'nav.videos': 'الفيديوهات',
    'nav.signOut': 'تسجيل الخروج',
    'nav.language': 'English',
    'nav.login': 'تسجيل الدخول',
    
    // Home Page
    'home.title': 'مرحباً بك في استوديو الفن',
    'home.subtitle': 'اكتشف إبداعك',
    'home.featured': 'الأعمال المميزة',
    'home.recentLessons': 'الدروس الحديثة',
    'home.recentVideos': 'الفيديوهات الحديثة',
    'home.startLearning': 'ابدأ التعلم',
    'home.viewAll': 'عرض الكل',
    'home.viewGallery': 'عرض المعرض',
    
    // About Page
    'about.title': 'حول الفنان',
    'about.biography': 'السيرة الذاتية',
    'about.achievements': 'الإنجازات',
    'about.education': 'التعليم',
    'about.exhibitions': 'المعارض',
    
    // Gallery Page
    'gallery.title': 'معرض الفن',
    'gallery.search': 'البحث عن الأعمال...',
    'gallery.all': 'الكل',
    'gallery.filter': 'تصفية',
    'gallery.sortBy': 'ترتيب حسب',
    'gallery.year': 'السنة',
    'gallery.title_sort': 'العنوان',
    'gallery.price': 'السعر',
    'gallery.share': 'مشاركة',
    'gallery.download': 'تحميل',
    'gallery.close': 'إغلاق',
    'gallery.noResults': 'لم يتم العثور على أعمال فنية',
    
    // Lessons Page
    'lessons.title': 'دروس الفن',
    'lessons.subtitle': 'تعلم خطوة بخطوة',
    'lessons.startLesson': 'بدء الدرس',
    'lessons.continue': 'المتابعة',
    'lessons.review': 'مراجعة',
    'lessons.completed': 'مكتمل',
    'lessons.minutes': 'دقيقة',
    'lessons.beginner': 'مبتدئ',
    'lessons.intermediate': 'متوسط',
    'lessons.advanced': 'متقدم',
    'lessons.progress': 'التقدم',
    'lessons.modules': 'وحدات',
    'lessons.duration': 'المدة',
    'lessons.learningProgress': 'تقدمك في التعلم',
    'lessons.inProgress': 'قيد التقدم',
    'lessons.available': 'متاح',
    'lessons.start': 'بدء',
    'lessons.moduleCompleted': 'تم إكمال الوحدة!',
    'lessons.moduleCompletedDesc': 'أحسنت! استمر في هذا التقدم الممتاز.',
    
    // Videos Page
    'videos.title': 'دروس الفيديو',
    'videos.gallery': 'معرض الفيديو',
    'videos.views': 'مشاهدة',
    'videos.loading': 'جاري تحميل الفيديوهات...',
    'videos.noVideos': 'لا توجد فيديوهات متاحة حتى الآن.',
    'videos.general': 'عام',
    
    // Auth Page
    'auth.signIn': 'تسجيل الدخول',
    'auth.signUp': 'إنشاء حساب',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.signingIn': 'جاري تسجيل الدخول...',
    'auth.signingUp': 'جاري إنشاء الحساب...',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.sending': 'جاري الإرسال...',
    
    // Admin Pages
    'admin.title': 'لوحة الإدارة',
    'admin.artworks': 'إدارة الأعمال الفنية',
    'admin.lessons': 'إدارة الدروس',
    'admin.videos': 'إدارة الفيديوهات',
    'admin.profile': 'إدارة الملف الشخصي',
    'admin.addArtwork': 'إضافة عمل فني',
    'admin.addLesson': 'إضافة درس',
    'admin.addVideo': 'إضافة فيديو',
    'admin.artistProfile': 'ملف الفنان',
    'admin.title_field': 'العنوان',
    'admin.description': 'الوصف',
    'admin.save': 'حفظ',
    'admin.cancel': 'إلغاء',
    'admin.edit': 'تعديل',
    'admin.delete': 'حذف',
    'admin.add': 'إضافة',
    'admin.upload': 'رفع',
    'admin.featured': 'مميز',
    'admin.published': 'منشور',
    'admin.available': 'متاح',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.close': 'إغلاق',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.notFound': 'الصفحة غير موجودة',
    'common.notFoundMessage': 'الصفحة التي تبحث عنها غير موجودة.',
    'common.returnHome': 'العودة للرئيسية',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}