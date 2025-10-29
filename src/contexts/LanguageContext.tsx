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
    
    // Home Page specific
    'home.categories': 'Categories',
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
    'gallery.loading': 'Loading artworks...',
    'gallery.artworks': 'artworks',
    'gallery.pieces': 'pieces',
    'gallery.seeAll': 'See All',
    'gallery.sortByYear': 'Sort by Year',
    'gallery.sortByTitle': 'Sort by Title',
    'gallery.featuredArtwork': 'Featured Artwork',
    'gallery.featured': 'Featured',
    'gallery.createdIn': 'Created in',
    'gallery.collection': 'Collection',
    'gallery.tryAdjustingFilters': 'Try adjusting your filters to see more results.',
    'gallery.fullScreen': 'Full Screen',
    'gallery.comments': 'Comments',
    'gallery.addComment': 'Add a comment...',
    'gallery.medium': 'Medium',
    'gallery.description': 'Description',
    'gallery.shareArtwork': 'Share Artwork',
    'gallery.notSpecified': 'Not specified',
    'gallery.signInToComment': 'Please sign in to add comments',
    'gallery.noComments': 'No comments yet. Be the first to comment!',
    
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
    'videos.noVideosFound': 'No videos found',
    'videos.checkBackLater': 'Check back later for new video content.',
    'videos.noDescription': 'No description available',
    'videos.videoNotAvailable': 'Video not available',
    'videos.videoTitle': 'Video title',
    'videos.browserNotSupported': 'Your browser does not support the video tag.',
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
    'admin.addNewArtwork': 'Add New Artwork',
    'admin.editArtwork': 'Edit Artwork',
    'admin.existingArtworks': 'Existing Artworks',
    'admin.image': 'Image',
    'admin.yearCreated': 'Year Created',
    'admin.price': 'Price ($)',
    'admin.medium': 'Medium',
    'admin.dimensions': 'Dimensions',
    'admin.updateArtwork': 'Update Artwork',
    'admin.cancelEdit': 'Cancel Edit',
    'admin.saving': 'Saving...',
    'admin.deleteConfirm': 'Are you sure you want to delete this artwork?',
    'admin.addNewLesson': 'Add New Lesson',
    'admin.editLesson': 'Edit Lesson',
    'admin.existingLessons': 'Existing Lessons',
    'admin.content': 'Content',
    'admin.videoUrl': 'Video URL',
    'admin.thumbnail': 'Thumbnail Image',
    'admin.duration': 'Duration (minutes)',
    'admin.orderIndex': 'Order Index',
    'admin.difficulty': 'Difficulty Level',
    'admin.category': 'Category',
    'admin.selectDifficulty': 'Select difficulty',
    'admin.updateLesson': 'Update Lesson',
    'admin.deleteLessonConfirm': 'Are you sure you want to delete this lesson?',
    'admin.manageProfile': 'Manage Artist Profile',
    'admin.artistName': 'Artist Name',
    'admin.shortBio': 'Short Bio',
    'admin.profileImage': 'Profile Image',
    'admin.aboutContent': 'About Me Content',
    'admin.education': 'Education',
    'admin.achievements': 'Achievements',
    'admin.exhibitions': 'Exhibitions',
    'admin.saveProfile': 'Save Profile',
    'admin.loadingProfile': 'Loading artist profile...',
    'admin.addNewVideo': 'Add New Video',
    'admin.editVideo': 'Edit Video',
    'admin.existingVideos': 'Existing Videos',
    'admin.videoFile': 'Video File',
    'admin.deleteVideoConfirm': 'Are you sure you want to delete this video?',
    'admin.updateVideo': 'Update Video',
    
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
    'stats.artworks': 'Artworks',
    'stats.videos': 'Videos',
    'stats.lessons': 'Lessons',
    'stats.progress': 'Progress',
    'home.views': 'views',
    'home.favorites': 'Your Favorites',
    'home.artworks': 'artworks',
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
    
    // Home Page specific
    'home.categories': 'الفئات',
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
    'gallery.loading': 'جاري تحميل الأعمال الفنية...',
    'gallery.artworks': 'أعمال فنية',
    'gallery.pieces': 'قطع',
    'gallery.seeAll': 'عرض الكل',
    'gallery.sortByYear': 'ترتيب حسب السنة',
    'gallery.sortByTitle': 'ترتيب حسب العنوان',
    'gallery.featuredArtwork': 'العمل الفني المميز',
    'gallery.featured': 'مميز',
    'gallery.createdIn': 'تم إنشاؤه في',
    'gallery.collection': 'المجموعة',
    'gallery.tryAdjustingFilters': 'جرب تعديل المرشحات لرؤية المزيد من النتائج.',
    'gallery.fullScreen': 'الشاشة الكاملة',
    'gallery.comments': 'التعليقات',
    'gallery.addComment': 'أضف تعليق...',
    'gallery.medium': 'الوسط',
    'gallery.description': 'الوصف',
    'gallery.shareArtwork': 'مشاركة العمل الفني',
    'gallery.notSpecified': 'غير محدد',
    'gallery.signInToComment': 'يرجى تسجيل الدخول لإضافة تعليق',
    'gallery.noComments': 'لا توجد تعليقات بعد. كن أول من يعلق!',
    
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
    'videos.noVideosFound': 'لم يتم العثور على فيديوهات',
    'videos.checkBackLater': 'تحقق مرة أخرى لاحقاً للحصول على محتوى فيديو جديد.',
    'videos.noDescription': 'لا يوجد وصف متاح',
    'videos.videoNotAvailable': 'الفيديو غير متاح',
    'videos.videoTitle': 'عنوان الفيديو',
    'videos.browserNotSupported': 'متصفحك لا يدعم تشغيل هذا الفيديو.',
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
    'admin.addNewArtwork': 'إضافة عمل فني جديد',
    'admin.editArtwork': 'تعديل عمل فني',
    'admin.existingArtworks': 'الأعمال الفنية الموجودة',
    'admin.image': 'الصورة',
    'admin.yearCreated': 'سنة الإنشاء',
    'admin.price': 'السعر ($)',
    'admin.medium': 'الوسط',
    'admin.dimensions': 'الأبعاد',
    'admin.updateArtwork': 'تحديث العمل الفني',
    'admin.cancelEdit': 'إلغاء التعديل',
    'admin.saving': 'جاري الحفظ...',
    'admin.deleteConfirm': 'هل أنت متأكد من حذف هذا العمل الفني؟',
    'admin.addNewLesson': 'إضافة درس جديد',
    'admin.editLesson': 'تعديل درس',
    'admin.existingLessons': 'الدروس الموجودة',
    'admin.content': 'المحتوى',
    'admin.videoUrl': 'رابط الفيديو',
    'admin.thumbnail': 'الصورة المصغرة',
    'admin.duration': 'المدة (بالدقائق)',
    'admin.orderIndex': 'مؤشر الترتيب',
    'admin.difficulty': 'مستوى الصعوبة',
    'admin.category': 'الفئة',
    'admin.selectDifficulty': 'اختر مستوى الصعوبة',
    'admin.updateLesson': 'تحديث الدرس',
    'admin.deleteLessonConfirm': 'هل أنت متأكد من حذف هذا الدرس؟',
    'admin.manageProfile': 'إدارة ملف الفنان',
    'admin.artistName': 'اسم الفنان',
    'admin.shortBio': 'نبذة مختصرة',
    'admin.profileImage': 'صورة الملف الشخصي',
    'admin.aboutContent': 'محتوى حولي',
    'admin.education': 'التعليم',
    'admin.achievements': 'الإنجازات',
    'admin.exhibitions': 'المعارض',
    'admin.saveProfile': 'حفظ الملف الشخصي',
    'admin.loadingProfile': 'جاري تحميل ملف الفنان...',
    'admin.addNewVideo': 'إضافة فيديو جديد',
    'admin.editVideo': 'تعديل فيديو',
    'admin.existingVideos': 'الفيديوهات الموجودة',
    'admin.videoFile': 'ملف الفيديو',
    'admin.deleteVideoConfirm': 'هل أنت متأكد من حذف هذا الفيديو؟',
    'admin.updateVideo': 'تحديث الفيديو',
    
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
    'stats.artworks': 'الأعمال الفنية',
    'stats.videos': 'الفيديوهات',
    'stats.lessons': 'الدروس',
    'stats.progress': 'التقدم',
    'home.views': 'مشاهدة',
    'home.favorites': 'المفضلة لديك',
    'home.artworks': 'أعمال فنية',
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