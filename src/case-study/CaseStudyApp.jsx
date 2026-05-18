// Lazy entry for the case-study route. Owns case-study-only CSS so the
// marketing bundle doesn't pull these styles. See src/main.jsx for the
// path-based dispatch — this module is only fetched when the URL is
// /case-study or /case-study/<slug>.

import './case-study.css';
import CaseStudyPage from './CaseStudyPage.jsx';

export default CaseStudyPage;
