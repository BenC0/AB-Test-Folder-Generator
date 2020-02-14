import isString from "./crough_modules/isString"
import isFunction from "./crough_modules/isFunction"
import elementExists from "./crough_modules/elementExists"
import pollFor from "./crough_modules/pollFor"
import onMouseLeave from "./crough_modules/onMouseLeave"
import onNoInteraction from "./crough_modules/onNoInteraction"
import onElementIsVisible from "./crough_modules/onElementIsVisible"
import gaSendEvent from "./crough_modules/gaSendEvent"
import croLog from "./crough_modules/croLog"
import mutationObserver from "./crough_modules/mutationObserver"

const cro = {
	"isString": isString,
	"isFunction": isFunction,
	"elementExists": elementExists,
	"pollFor": pollFor,
	"onMouseLeave": onMouseLeave,
	"onNoInteraction": onNoInteraction,
	"onElementIsVisible": onElementIsVisible,
	"gaSendEvent": gaSendEvent,
	"croLog": croLog,
	"mutationObserver": mutationObserver,
}

export default cro