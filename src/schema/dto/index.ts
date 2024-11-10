import {t} from "elysia"

const UpdateTeam = t.Object({
    address: t.String(),
    mercSelected: t.Array(t.Number()),
    dataThatWasSigned: t.String(),
    signature: t.String(),
})

const requestAddress = t.Object({
    address: t.String(),
})

const getMercInArr = t.Object({
    address: t.String(),
    hash: t.String(),
})

const getHitOfMerc = t.Object({
    number: t.Number(),
})
const rqDetached = t.Object({
    address: t.String(),
    merNumber: t.Number(),
    type: t.String(),
    signature: t.String(),
    dataThatWasSigned: t.String(),
})

const startUpDto = t.Object({
    address: t.String(),
    listMer: t.Array(t.Number()),
    hash: t.String(),
})

const levelUpDto = t.Object({
    address: t.String(),
    listMer: t.Array(t.Number()),
    hash: t.String(),
})
// address, number, difficulty, dataThatWasSigned, signature
const attackDto = t.Object({
    address: t.String(),
    mercNumber: t.Number(),
    difficulty: t.Number(),
    dataThatWasSigned: t.String(),
    signature: t.String(),
})

const speedBattleDto = t.Object({
    address: t.String(),
    difficulty: t.Number(),
    dataThatWasSigned: t.String(),
    signature: t.String(),
})

const useCoinDto = t.Object({
    address: t.String(),
    dataThatWasSigned: t.String(),
    signature: t.String(),
})

const buyCoinDto = t.Object({
    address: t.String(),
    hash: t.String()
})
export {
    UpdateTeam,
    requestAddress,
    getMercInArr,
    getHitOfMerc,
    rqDetached,
    startUpDto,
    levelUpDto,
    attackDto,
    speedBattleDto,
    useCoinDto,
    buyCoinDto
}
