// generate unique name for my team

import {colors , names,countries, Config, uniqueNamesGenerator} from 'unique-names-generator'

const config:Config = {
    dictionaries: [colors , names,countries],
    separator: '-',
    length: 2,
}

export function getUniqueTeamName(){
    return uniqueNamesGenerator(config)
}