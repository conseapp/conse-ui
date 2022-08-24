export default function getRole( role_id ) {
    let output = ''

    if ( role_id === '62ff5f2294474205d5992118' ) output = 'دکتر'
    else if ( role_id === '62ff5fc894474205d599211d' ) output = 'کارآگاه'
    else if ( role_id === '62ff89830bd1f9c22ec75cc0' ) output = 'رئیس مافیا'
    else if ( role_id === '62ff89ee0bd1f9c22ec75cc2' ) output = 'شب خسب'
    else if ( role_id === '62ff8a5e0bd1f9c22ec75cc6' ) output = 'جلب'
    else if ( role_id === '62ff8a680bd1f9c22ec75cc8' ) output = 'جراح'
    else if ( role_id === '62ff8a7a0bd1f9c22ec75cca' ) output = 'دکتر ستاره دار'
    else if ( role_id === '62ff8ad10bd1f9c22ec75ccc' ) output = 'شهردار'
    else if ( role_id === '62ff8adb0bd1f9c22ec75cce' ) output = 'قاضی'
    else if ( role_id === '62ff8ae20bd1f9c22ec75cd0' ) output = 'کلانتر'
    else if ( role_id === '62ff8ae80bd1f9c22ec75cd2' ) output = 'گورکن'
    else if ( role_id === '62ff8af30bd1f9c22ec75cd4' ) output = 'گورکن ستاره دار'
    else if ( role_id === '62ff8afc0bd1f9c22ec75cd6' ) output = 'دست کج'
    else if ( role_id === '62ff8b060bd1f9c22ec75cd8' ) output = 'گردن کلفت'

    return output
}