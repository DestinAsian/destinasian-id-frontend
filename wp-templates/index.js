import category from './category'
import tag from './tag'
import frontPage from './front-page'
import page from './page'
import page404 from './page-404-page'
import pageContests from './page-contests'
import pageNewsletter from './page-newsletter'
import pageLuxeList from './page-luxe-list'
import pageTravelGuides from './page-travel-guides'
import pageVideos from './page-videos'
import PagePreviewHomepage from "./page-preview-homepage";

import single from './single'
import singleGuide from './single-guide'
import singleEditorial from './single-editorial'
import singleUpdate from './single-update'
import singleContest from './single-contest'
import singleLuxeList from './single-luxe-list'
import singleLuxuryTravel from './single-luxury-travel'

export default {
  category,
  tag,
  'front-page': frontPage,
  page,
  'page-404-page': page404,
  'page-contests': pageContests,
  'page-luxe-list': pageLuxeList,
  'page-newsletter': pageNewsletter,
  'page-travel-guides': pageTravelGuides,
  'page-videos': pageVideos,
  "page-preview-homepage": PagePreviewHomepage,
  single,
  'single-guide': singleGuide,
  'single-editorial': singleEditorial,
  'single-update': singleUpdate,
  'single-contest': singleContest,
  'single-luxe-list': singleLuxeList,
  'single-luxury-travel': singleLuxuryTravel,
}
