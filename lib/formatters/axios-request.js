import pick from 'lodash.pick';
const formatter = (dumpable, _logLevel) => {
    const vals = pick(dumpable, ['url', 'headers']);
    return vals;
};
export default formatter;
//# sourceMappingURL=axios-request.js.map