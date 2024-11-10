const getDetail = (description: string, tags: string[], security: any) => {
    return {
        tags,
        description,
        security
    }
}

export {getDetail}