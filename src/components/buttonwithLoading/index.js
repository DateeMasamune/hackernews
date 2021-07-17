import withLoading from "../withLoading";
import Button from "../button";

const ButtonWithLoading = withLoading(Button); // Компонент высшего порядка который принимает другой компонент и возвращает компонент

export default ButtonWithLoading;