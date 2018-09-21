export const PROSPECT_INFO = () => {
    const PROFILE_PICTURE = '.pv-top-card-section__photo';
    const PROFILE_TITLE = '.pv-top-card-section__headline';
    const PROFILE_NAME = '.pv-top-card-section__name';
    const PROFILE_CIRCLE = '.pv-top-card-section__distance-badge .dist-value';
    const PROFILE_LOCATION = '.pv-top-card-section__location';

    const titleBlock = document.querySelector(PROFILE_TITLE);
    const avatarBlock = document.querySelector(PROFILE_PICTURE);
    const nameBlock = document.querySelector(PROFILE_NAME);
    const circleBlock = document.querySelector(PROFILE_CIRCLE);
    const locationBlock = document.querySelector(PROFILE_LOCATION);

    return {
        title: titleBlock.innerText,
        picture: avatarBlock ? avatarBlock.style.backgroundImage.replace('url("', '').replace('")', '') : '',
        name: nameBlock.innerText,
        connectionDegree: parseInt(circleBlock.innerText), // '1-st' to 1
        location: locationBlock.innerText,
        linkedInProfileLink: location.href
    };
}
export const USER_AVATAR = () => {
    const USER_AVATAR = '.feed-identity-module__member-photo';
    return document.querySelector(USER_AVATAR).src
}

export const QUERY_HIGHLIGHTS_BLOCK = () => {
    const HIGHLIGHTS_BLOCK = '.pv-highlight-entity.ember-view'
    return !!document.querySelector(HIGHLIGHTS_BLOCK);
}
export const QUERY_PROFILE_READY = () => {
    const EXPERIENCE_BLOCK = '#experience-section';
    const INTERESTS_BLOCK = '.pv-interests-section';
    const EDUCACTION_BLOCK = '#education-section';
    const SKILLS_BLOCK = '.pv-skill-categories-section';

    return !!document.querySelector(EXPERIENCE_BLOCK) ||
        !!document.querySelector(INTERESTS_BLOCK) ||
        !!document.querySelector(EDUCACTION_BLOCK) ||
        !!document.querySelector(SKILLS_BLOCK);
}
export const QUERY_NEXT_BUTTON = () => {
    const MUTUALS_NEXT_BTN = 'button.next';
    return !!document.querySelector(MUTUALS_NEXT_BTN)
}
export const MUTUALS_COUNT = () => {
    const MUTUALS_COUNT = '.pv-highlight-entity__primary-text';
    return parseInt(document.querySelector(MUTUALS_COUNT).innerText)
}
export const GO_TO_NEXT_PAGE = () => {
    const MUTUALS_NEXT_BTN = 'button.next';
    document.querySelector(MUTUALS_NEXT_BTN).click();
}

export const FETCH_MUTUALS_LINK = () => {
    const MUTUALS_LINK = 'a[data-control-name=highlight_entity_url_card_action_click]';
    return document.querySelector(MUTUALS_LINK).href;
}

export const FETCH_MUTUALS_LIST = () => {
    const SEARCH_PERSON = '.search-result__occluded-item .search-result--person';
    const MUTUAL_LINK = '.search-result__result-link';
    const MUTUAL_CIRCLE = '.dist-value';
    const MUTUAL_IMAGE = '.presence-entity__image';
    const MUTUAL_NAME = '.name.actor-name';
    const MUTUAL_TITLE = '.search-result__truncate.subline-level-1';

    let res = document.querySelectorAll(SEARCH_PERSON);
    let a = [];

    res.forEach(mut => {
        const linkBlock = mut.querySelector(MUTUAL_LINK);
        const avatarBlock = mut.querySelector(MUTUAL_IMAGE);
        const circleBlock = mut.querySelector(MUTUAL_CIRCLE);
        const nameBlock = mut.querySelector(MUTUAL_NAME);
        const titleBlock = mut.querySelector(MUTUAL_TITLE);

        console.log('Mutual fields:', linkBlock, avatarBlock, circleBlock, nameBlock, titleBlock)

        a.push({
            url: linkBlock.href,
            image: avatarBlock ? avatarBlock.style.backgroudImage : '',
            circle: parseInt(circleBlock.innerText),
            name: nameBlock.innerText,
            title: titleBlock.innerText
        });
    });
    return a;
}
export const QUERY_PROFILE_BLOCK = () => {
    const PROFILE_BLOCK = '.profile-rail-card__member-photo';
    return !!document.querySelector(PROFILE_BLOCK);
}