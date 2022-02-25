import {addLogs, addCrashReporting } from './middlewares';
import { applyAllMiddlewares } from './applyMiddleware';
import {store} from '../../../FrontEndToolBoxes/index';
export default ()=>{
    applyAllMiddlewares(store, [addLogs, addCrashReporting])
};
