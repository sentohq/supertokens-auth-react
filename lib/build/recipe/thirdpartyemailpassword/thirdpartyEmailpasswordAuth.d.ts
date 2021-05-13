/// <reference types="react" />
export default function ThirdPartyAuthWrapper({
    children,
    requireAuth,
    recipeId,
}: {
    children: JSX.Element;
    requireAuth?: boolean;
    recipeId?: any;
}): JSX.Element;
