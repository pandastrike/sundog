import {empty, isString} from "panda-parchment"
import {collect} from "panda-river"
import {where} from "./private-utils"
import {root, regularlyQualify} from "../helpers/url"
import {prepareModule} from "../lift"

acmPrimitive = (options) ->
  (configuration) ->
    acm = prepareModule options, configuration,
      require("aws-sdk/clients/acm"),
      [
        "liftCertificates"
        "describeCertificate"
      ]

    wild = (name) -> regularlyQualify "*." + root name
    apex = (name) -> regularlyQualify root name

    getCertList = ->
      data = await acm.listCertificates CertificateStatuses: [ "ISSUED" ]
      data.CertificateSummaryList

    # Look for certs that contain wildcard permissions
    match = (name, list) ->
      certs = collect where {DomainName: wild name}, list
      return certs[0].CertificateArn if !empty certs # Found what we need.

      # No primary wildcard cert.  Look for apex.
      certs = collect where {DomainName: apex name}, list
      for cert in certs
        data = await acm.describeCertificate {CertificateArn: cert.CertificateArn}
        alternates = data.Certificate.SubjectAlternativeNames
        return cert.CertificateArn if wild(name) in alternates

      false # Failed to find wildcard cert among alternate names.

    fetch = (name) ->
      try
        await match name, await getCertList()
      catch e
        console.error "Unexpected response while searching TLS certs. #{e}"
        throw new Error()

    {fetch}


export default acmPrimitive
