/**
 * On full page load, strip the URL hash and scroll to the top so refresh
 * always lands on the hero instead of a hash anchor. In-page hash links still
 * work because this runs once before hydration, not on anchor clicks.
 */
export const resetHashScrollOnLoadScript = `(function(){if(location.hash){history.replaceState(null,"",location.pathname+location.search)}scrollTo(0,0)})();`;
