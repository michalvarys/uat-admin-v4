import type { Schema, Attribute } from '@strapi/strapi';

export interface EntriesTeacherEntry extends Schema.Component {
  collectionName: 'components_entries_teacher_entries';
  info: {
    name: 'teacher_entry';
    displayName: 'teacher_entry';
    icon: 'microscope';
    description: '';
  };
  attributes: {
    teacher: Attribute.Relation<
      'entries.teacher-entry',
      'oneToOne',
      'api::teacher.teacher'
    >;
    title: Attribute.String & Attribute.Private;
  };
}

export interface EntriesStudyEntry extends Schema.Component {
  collectionName: 'components_entries_study_entries';
  info: {
    name: 'study_entry';
    displayName: 'study_entry';
    icon: 'pen-fancy';
    description: '';
  };
  attributes: {
    field_of_study: Attribute.Relation<
      'entries.study-entry',
      'oneToOne',
      'api::field-of-study.field-of-study'
    >;
    title: Attribute.String & Attribute.Private;
  };
}

export interface EntriesStatisticEntry extends Schema.Component {
  collectionName: 'components_entries_statistic_entries';
  info: {
    name: 'statistic_entry';
    displayName: 'statistic_entry';
    icon: 'user-graduate';
  };
  attributes: {
    year: Attribute.String & Attribute.Required;
    single_entry: Attribute.Component<'entries.single-entry', true>;
  };
}

export interface EntriesSingleEntry extends Schema.Component {
  collectionName: 'components_entries_single_entries';
  info: {
    name: 'single_entry';
    displayName: 'single_entry';
    icon: 'angle-right';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    value: Attribute.String & Attribute.Required;
  };
}

export interface EntriesGallery extends Schema.Component {
  collectionName: 'components_entries_galleries';
  info: {
    name: 'gallery';
    displayName: 'gallery';
    icon: 'grimace';
    description: '';
  };
  attributes: {
    galleries_uat: Attribute.Relation<
      'entries.gallery',
      'oneToOne',
      'api::gallery-uat.gallery-uat'
    >;
    title: Attribute.String & Attribute.Private;
  };
}

export interface EntriesFestivalEntry extends Schema.Component {
  collectionName: 'components_entries_festival_entries';
  info: {
    name: 'festival_entry';
    displayName: 'festival_entry';
    icon: 'baby-carriage';
    description: '';
  };
  attributes: {
    festival: Attribute.Relation<
      'entries.festival-entry',
      'oneToOne',
      'api::festival.festival'
    >;
    title: Attribute.String & Attribute.Private;
  };
}

export interface EntriesEuProjectEntry extends Schema.Component {
  collectionName: 'components_entries_eu_project_entries';
  info: {
    name: 'eu_project_entry';
    displayName: 'eu_project_entry';
    icon: 'desktop';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    link: Attribute.String & Attribute.Required;
    description: Attribute.String;
  };
}

export interface NavigationInternalLink extends Schema.Component {
  collectionName: 'components_navigation_internal_links';
  info: {
    name: 'InternalLink';
    displayName: 'InternalLink';
    icon: 'link';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    path: Attribute.String;
  };
}

export interface NavigationImageBoxLink extends Schema.Component {
  collectionName: 'components_navigation_image_box_links';
  info: {
    name: 'ImageBoxLink';
    displayName: 'ImageBoxLink';
    icon: 'image';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    subtitle: Attribute.String;
    image_200x70: Attribute.Media<'images'> & Attribute.Required;
  };
}

export interface NavigationFooterSection extends Schema.Component {
  collectionName: 'components_navigation_footer_sections';
  info: {
    name: 'FooterSection';
    displayName: 'FooterSection';
    icon: 'bookmark';
    description: '';
  };
  attributes: {
    links: Attribute.Component<'navigation.internal-link', true>;
    title: Attribute.String;
  };
}

export interface NavigationExternalLink extends Schema.Component {
  collectionName: 'components_navigation_external_links';
  info: {
    name: 'ExternalLink';
    displayName: 'ExternalLink';
    icon: 'external-link-alt';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    url: Attribute.String & Attribute.Required;
  };
}

export interface NavigationDownloadLink extends Schema.Component {
  collectionName: 'components_navigation_download_links';
  info: {
    name: 'DownloadLink';
    displayName: 'DownloadLink';
    icon: 'apple-alt';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    url: Attribute.String & Attribute.Required;
  };
}

export interface NavigationConditionalInternalLink extends Schema.Component {
  collectionName: 'components_navigation_conditional_internal_links';
  info: {
    name: 'ConditionalInternalLink';
    displayName: 'ConditionalInternalLink';
    icon: 'external-link-square-alt';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    subtitle: Attribute.String;
    isVisible: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
  };
}

export interface NavigationConditionalExternalLink extends Schema.Component {
  collectionName: 'components_navigation_conditional_external_links';
  info: {
    name: 'ConditionalExternalLink';
    displayName: 'ConditionalExternalLink';
    icon: 'unlink';
    description: '';
  };
  attributes: {
    url: Attribute.String & Attribute.Required;
    title: Attribute.String;
    isVisible: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
  };
}

export interface SharedYouTubePlayerSlice extends Schema.Component {
  collectionName: 'components_shared_you_tube_player_slices';
  info: {
    name: 'YouTubePlayerSlice';
    icon: 'play-circle';
    description: '';
    displayName: 'YouTubePlayerSlice';
  };
  attributes: {
    youtube_video_id: Attribute.String & Attribute.Required;
    cover_image: Attribute.Media<'images'>;
  };
}

export interface SharedVideoWithTextSlice extends Schema.Component {
  collectionName: 'components_shared_video_with_text_slices';
  info: {
    name: 'VideoWithTextSlice';
    displayName: 'VideoWithTextSlice';
    icon: 'file-video';
    description: '';
  };
  attributes: {
    content: Attribute.RichText & Attribute.Required;
    download_link: Attribute.Component<'navigation.external-link'>;
    cover_image: Attribute.Media<'images'> & Attribute.Required;
    link: Attribute.Component<'navigation.external-link'>;
    youtube_video_id: Attribute.String & Attribute.Required;
  };
}

export interface SharedTextWithImage extends Schema.Component {
  collectionName: 'components_shared_text_with_image_slice';
  info: {
    name: 'TextWithImageSlice';
    displayName: 'TextWithImageSlice';
    icon: 'align-justify';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    subtitle: Attribute.String;
    content: Attribute.RichText & Attribute.Required;
    left_side_image: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    image: Attribute.Media<'images'> & Attribute.Required;
    download_link: Attribute.Component<'navigation.internal-link'>;
    link: Attribute.Component<'navigation.internal-link'>;
  };
}

export interface SharedTeachersSlice extends Schema.Component {
  collectionName: 'components_shared_teachers_slices';
  info: {
    name: 'TeachersSlice';
    displayName: 'TeachersSlice';
    icon: 'chalkboard-teacher';
    description: '';
  };
  attributes: {
    teachers: Attribute.Component<'entries.teacher-entry', true>;
  };
}

export interface SharedTabs extends Schema.Component {
  collectionName: 'components_shared_tabs';
  info: {
    name: 'Tabs';
    displayName: 'Tabs';
    icon: 'grip-horizontal';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.Text;
    tabs: Attribute.Component<'shared.tab-item', true>;
  };
}

export interface SharedTabItem extends Schema.Component {
  collectionName: 'components_shared_tab_items';
  info: {
    name: 'TabItem';
    displayName: 'TabItem';
    icon: 'clipboard-list';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    items: Attribute.Component<'shared.tab-item-content', true>;
  };
}

export interface SharedTabItemContent extends Schema.Component {
  collectionName: 'components_shared_tab_item_contents';
  info: {
    name: 'TabItemContent';
    displayName: 'TabItemContent';
    icon: 'align-left';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    content: Attribute.RichText;
    links: Attribute.Relation<
      'shared.tab-item-content',
      'oneToMany',
      'api::news-entry.news-entry'
    >;
  };
}

export interface SharedSubjects extends Schema.Component {
  collectionName: 'components_shared_subjects';
  info: {
    name: 'Subjects';
    displayName: 'Subjects';
    icon: 'book';
  };
  attributes: {
    header: Attribute.String & Attribute.Required;
    sections: Attribute.Component<'shared.subjects-section', true>;
    sponsor: Attribute.Component<'shared.sponsor'>;
  };
}

export interface SharedSubjectsSection extends Schema.Component {
  collectionName: 'components_shared_subjects_sections';
  info: {
    name: 'SubjectsSection';
    displayName: 'SubjectsSection';
    icon: 'book-open';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    list: Attribute.Component<'shared.short-text', true>;
  };
}

export interface SharedSponsor extends Schema.Component {
  collectionName: 'components_shared_sponsors';
  info: {
    name: 'Sponsor';
    displayName: 'Sponsor';
    icon: 'ad';
  };
  attributes: {
    text: Attribute.RichText & Attribute.Required;
    image: Attribute.Media<'images'> & Attribute.Required;
  };
}

export interface SharedSingleWinner extends Schema.Component {
  collectionName: 'components_shared_single_winners';
  info: {
    name: 'single_winner';
    displayName: 'SingleWinner';
    icon: 'award';
    description: '';
  };
  attributes: {
    place: Attribute.String & Attribute.Required;
    title: Attribute.String & Attribute.Required;
    subtitle: Attribute.String & Attribute.Required;
    author: Attribute.String & Attribute.Required;
    link: Attribute.String;
    image: Attribute.Media<'images'> & Attribute.Required;
  };
}

export interface SharedShortText extends Schema.Component {
  collectionName: 'components_shared_short_texts';
  info: {
    name: 'ShortText';
    displayName: 'ShortText';
    icon: 'align-center';
  };
  attributes: {
    text: Attribute.String & Attribute.Required;
  };
}

export interface SharedRichTextWithTitle extends Schema.Component {
  collectionName: 'components_shared_rich_text_with_title';
  info: {
    name: 'RichTextWithTitle';
    displayName: 'RichTextWithTitle';
    icon: 'edit';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    content: Attribute.RichText & Attribute.Required;
  };
}

export interface SharedPrizes extends Schema.Component {
  collectionName: 'components_shared_prizes';
  info: {
    name: 'prizes';
    displayName: 'Prizes';
    icon: 'th-large';
    description: '';
  };
  attributes: {
    first_prize: Attribute.String & Attribute.Required;
    second_prize: Attribute.String & Attribute.Required;
    third_prize: Attribute.String & Attribute.Required;
    special_prize: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    honorable_mentions: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
  };
}

export interface SharedGallery extends Schema.Component {
  collectionName: 'components_shared_galleries';
  info: {
    name: 'Gallery';
    displayName: 'Gallery';
    icon: 'images';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    gallery_item: Attribute.Component<'shared.gallery-image', true>;
  };
}

export interface SharedGalleryImage extends Schema.Component {
  collectionName: 'components_shared_gallery_images';
  info: {
    name: 'GalleryImage';
    displayName: 'GalleryImage';
    icon: 'file-image';
    description: '';
  };
  attributes: {
    thumbnail_410x551: Attribute.Media<'images'> & Attribute.Required;
    fullsize: Attribute.Media<'images'> & Attribute.Required;
  };
}

export interface SharedFestivalWinners extends Schema.Component {
  collectionName: 'components_shared_festival_winners';
  info: {
    name: 'festivalWinners';
    displayName: 'festivalWinners';
    icon: 'fingerprint';
    description: '';
  };
  attributes: {
    single_winner: Attribute.Component<'shared.single-winner', true>;
    year: Attribute.String & Attribute.Required;
  };
}

export interface SharedFestivalPrizes extends Schema.Component {
  collectionName: 'components_shared_festival_prizes';
  info: {
    name: 'festival_prizes';
    displayName: 'festival_prizes';
    icon: 'republican';
  };
  attributes: {
    first_prize: Attribute.String & Attribute.Required;
    second_prize: Attribute.String & Attribute.Required;
    third_prize: Attribute.String & Attribute.Required;
    special_prize: Attribute.String;
    honorable_mention: Attribute.String;
  };
}

export interface SharedEmploymentStatistics extends Schema.Component {
  collectionName: 'components_shared_employment_statistics';
  info: {
    name: 'employment_statistics';
    displayName: 'EmploymentStatistics';
    icon: 'angle-double-up';
  };
  attributes: {
    statistic_entry: Attribute.Component<'entries.statistic-entry', true>;
  };
}

export interface SharedCode extends Schema.Component {
  collectionName: 'components_shared_codes';
  info: {
    name: 'code';
    displayName: 'code';
    icon: 'code';
  };
  attributes: {
    content: Attribute.RichText & Attribute.Required;
  };
}

export interface SharedCards extends Schema.Component {
  collectionName: 'components_shared_cards';
  info: {
    name: 'Cards';
    displayName: 'Cards';
    icon: 'pager';
  };
  attributes: {
    CardItem: Attribute.Component<'shared.card-item', true>;
  };
}

export interface SharedCardItem extends Schema.Component {
  collectionName: 'components_shared_card_items';
  info: {
    name: 'CardItem';
    displayName: 'CardItem';
    icon: 'columns';
  };
  attributes: {
    Link: Attribute.Component<'navigation.external-link'>;
    Image: Attribute.Media<'images'> & Attribute.Required;
  };
}

export interface SharedApplicationsAtUniversity extends Schema.Component {
  collectionName: 'components_shared_applications_at_universities';
  info: {
    name: 'applications_at_university';
    displayName: 'applications_at_university';
    icon: 'address-card';
  };
  attributes: {
    header: Attribute.String & Attribute.Required;
    sections: Attribute.Component<'shared.subjects-section', true>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'entries.teacher-entry': EntriesTeacherEntry;
      'entries.study-entry': EntriesStudyEntry;
      'entries.statistic-entry': EntriesStatisticEntry;
      'entries.single-entry': EntriesSingleEntry;
      'entries.gallery': EntriesGallery;
      'entries.festival-entry': EntriesFestivalEntry;
      'entries.eu-project-entry': EntriesEuProjectEntry;
      'navigation.internal-link': NavigationInternalLink;
      'navigation.image-box-link': NavigationImageBoxLink;
      'navigation.footer-section': NavigationFooterSection;
      'navigation.external-link': NavigationExternalLink;
      'navigation.download-link': NavigationDownloadLink;
      'navigation.conditional-internal-link': NavigationConditionalInternalLink;
      'navigation.conditional-external-link': NavigationConditionalExternalLink;
      'shared.you-tube-player-slice': SharedYouTubePlayerSlice;
      'shared.video-with-text-slice': SharedVideoWithTextSlice;
      'shared.text-with-image': SharedTextWithImage;
      'shared.teachers-slice': SharedTeachersSlice;
      'shared.tabs': SharedTabs;
      'shared.tab-item': SharedTabItem;
      'shared.tab-item-content': SharedTabItemContent;
      'shared.subjects': SharedSubjects;
      'shared.subjects-section': SharedSubjectsSection;
      'shared.sponsor': SharedSponsor;
      'shared.single-winner': SharedSingleWinner;
      'shared.short-text': SharedShortText;
      'shared.rich-text-with-title': SharedRichTextWithTitle;
      'shared.prizes': SharedPrizes;
      'shared.gallery': SharedGallery;
      'shared.gallery-image': SharedGalleryImage;
      'shared.festival-winners': SharedFestivalWinners;
      'shared.festival-prizes': SharedFestivalPrizes;
      'shared.employment-statistics': SharedEmploymentStatistics;
      'shared.code': SharedCode;
      'shared.cards': SharedCards;
      'shared.card-item': SharedCardItem;
      'shared.applications-at-university': SharedApplicationsAtUniversity;
    }
  }
}
