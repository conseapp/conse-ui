const checkOtp = async (phone, code, time) => {
    let body = JSON.stringify({
        "phone": phone,
        "code": code,
        "time": time
    })

    let options = {
        method: 'POST',
        body: body
    }

    let request = await fetch(`${process.env.AUTH_URL}/auth/check-otp`, options)

    return await request.json()
}

export default checkOtp