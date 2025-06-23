import category from './category'
import tag from './tag'
import frontPage from './front-page'
import page from './page'
import page404 from './page-404-page'
import pageContests from './page-contests'
import pageNewsletter from './page-newsletter'
import pageTravelGuides from './page-travel-guides'
import pageVideos from './page-videos'
import PagePreviewHomepage from "./page-preview-homepage";

import single from './single'

import singleContest from './single-contest'
import singleLuxuryTravel from './single-luxury-travel'
import singleTravelGuide from './single-travel-guide'

export default {
  category,
  tag,
  'front-page': frontPage,
  page,
  'page-404-page': page404,
  'page-contests': pageContests,
  'page-newsletter': pageNewsletter,
  'page-travel-guides': pageTravelGuides,
  'page-videos': pageVideos,
  "page-preview-homepage": PagePreviewHomepage,
  single,
  'single-travel-guide': singleTravelGuide,
  'single-contest': singleContest,
  'single-luxury-travel': singleLuxuryTravel,
}