// Taxonomies
import CategoryTemplate from './category'
import TagTemplate from './tag'

// Pages
import FrontPageTemplate from './front-page'
import PageTemplate from './page'
import Page404Template from './page-404-page'
import PageContestsTemplate from './page-contests'
import PagePreviewHomepageTemplate from './page-preview-homepage'

// Singles
import SingleTemplate from './single'
import SingleContestTemplate from './single-contest'
import SingleLuxuryTravelTemplate from './single-luxury-travel'
import SingleTravelGuideTemplate from './single-travel-guide'

export default {
  // Taxonomy templates
  category: CategoryTemplate,
  tag: TagTemplate,

  // Page templates
  'front-page': FrontPageTemplate,
  page: PageTemplate,
  'page-404-page': Page404Template,
  'page-contests': PageContestsTemplate,
  'page-preview-homepage': PagePreviewHomepageTemplate,

  // Single templates
  single: SingleTemplate,
  'single-contest': SingleContestTemplate,
  'single-luxury-travel': SingleLuxuryTravelTemplate,
  'single-travel-guide': SingleTravelGuideTemplate,
}
