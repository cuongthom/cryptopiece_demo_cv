import {getDetail} from "../untils/swagger";
import ITransactionAttack from "../schema/TransactionAttackSchema";

const TransactionAttackController = (app: any) => {
    return app.group("/transactionAttack", (ctx: any) => {

        ctx.get('', async ({query}: any) => {
            const {address} = query
            return ITransactionAttack.find({address}).sort({time_attack: -1});
        }, {
            detail: getDetail("", ["transactionAttack"], []),
        })
        return ctx;
    });
};

export default TransactionAttackController;
