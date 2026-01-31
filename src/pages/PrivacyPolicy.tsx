import { PageHeader } from "@/components/page-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Eye, Users, Baby, UserCheck, Mail, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PrivacyPolicy() {
  const { t } = useLanguage();

  const sections = [
    {
      icon: Eye,
      titleKey: 'privacy.infoCollectTitle',
      contentKey: 'privacy.infoCollectContent',
    },
    {
      icon: Shield,
      titleKey: 'privacy.howWeUseTitle',
      contentKey: 'privacy.howWeUseContent',
    },
    {
      icon: Lock,
      titleKey: 'privacy.dataStorageTitle',
      contentKey: 'privacy.dataStorageContent',
    },
    {
      icon: Users,
      titleKey: 'privacy.thirdPartyTitle',
      contentKey: 'privacy.thirdPartyContent',
    },
    {
      icon: Baby,
      titleKey: 'privacy.childrenTitle',
      contentKey: 'privacy.childrenContent',
    },
    {
      icon: UserCheck,
      titleKey: 'privacy.yourRightsTitle',
      contentKey: 'privacy.yourRightsContent',
    },
    {
      icon: Mail,
      titleKey: 'privacy.contactTitle',
      contentKey: 'privacy.contactContent',
    },
    {
      icon: RefreshCw,
      titleKey: 'privacy.updatesTitle',
      contentKey: 'privacy.updatesContent',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader title={t('privacy.title')} />
      
      <div className="px-4">
        {/* Header Card */}
        <Card className="bg-card border-border/20 p-6 mb-6 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-warm-gold/20 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-warm-gold" />
            </div>
            <h1 className="text-2xl font-bold text-card-foreground mb-2">
              {t('privacy.title')}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t('privacy.lastUpdated')}: January 31, 2025
            </p>
          </div>
        </Card>

        {/* Introduction */}
        <Card className="bg-card border-border/20 p-6 mb-6 shadow-xl">
          <p className="text-card-foreground/90 leading-relaxed">
            {t('privacy.intro')}
          </p>
        </Card>

        {/* Policy Sections */}
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index} className="bg-card border-border/20 p-6 mb-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Icon className="w-5 h-5 text-warm-gold" />
                <h2 className="text-xl font-bold text-card-foreground">
                  {t(section.titleKey)}
                </h2>
              </div>
              <p className="text-card-foreground/90 leading-relaxed whitespace-pre-line">
                {t(section.contentKey)}
              </p>
            </Card>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
