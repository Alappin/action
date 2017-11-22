import {$$asyncIterator} from 'iterall';
import getPubSub from 'server/utils/getPubSub';

const defaultFilterFn = () => true;

const makeSubscribeIter = (channelName, options = {}) => {
  const {filterFn = defaultFilterFn, resolve} = options;
  const asyncIterator = getPubSub().asyncIterator(channelName);
  const getNextPromise = async () => {
    const nextRes = await asyncIterator.next();
    const {value, done} = nextRes;
    console.log('next redis from message:', nextRes);
    if (done) {
      return asyncIterator.return();
    }

    if (filterFn(value)) {
      if (resolve) {
        return {
          done: false,
          value: await resolve(value)
        };
      }
      return nextRes;
    }
    // if the value doesn't get filtered, send it to the client. else, restart the listener
    return getNextPromise();
  };

  return {
    next() {
      return getNextPromise();
    },
    return() {
      return asyncIterator.return();
    },
    throw(error) {
      return asyncIterator.throw(error);
    },
    [$$asyncIterator]() {
      return this;
    }
  };
};

export default makeSubscribeIter;
