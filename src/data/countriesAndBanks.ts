import { CountryData } from '../types/banking.ts';

export const COUNTRIES_AND_BANKS: CountryData[] = [
  {
    country: 'Afghanistan',
    code: 'AF',
    currency: 'AFN',
    banks: [
      { name: 'Da Afghanistan Bank (Central Bank)', swiftPrefix: 'DABKAFKB', code: 'DAB' },
      { name: 'Afghanistan International Bank (AIB)', swiftPrefix: 'AFINAFKB', code: 'AIB' },
      { name: 'Azizi Bank', swiftPrefix: 'AZBAAFKB', code: 'AZI' },
      { name: 'Pashtany Bank', swiftPrefix: 'PABKAFKB', code: 'PAS' }
    ]
  },
  {
    country: 'Albania',
    code: 'AL',
    currency: 'ALL',
    banks: [
      { name: 'Bank of Albania', swiftPrefix: 'BOPBALTR', code: 'BOA' },
      { name: 'Banka Kombëtare Tregtare (BKT)', swiftPrefix: 'NCBKALTX', code: 'BKT' },
      { name: 'Raiffeisen Bank Albania', swiftPrefix: 'RZBAALTR', code: 'RZBA' },
      { name: 'Credins Bank', swiftPrefix: 'CDINALTX', code: 'CDIN' },
      { name: 'Intesa Sanpaolo Bank Albania', swiftPrefix: 'ISBAALTR', code: 'ISBA' }
    ]
  },
  {
    country: 'Algeria',
    code: 'DZ',
    currency: 'DZD',
    banks: [
      { name: 'Banque Nationale d\'Algérie (BNA)', swiftPrefix: 'BNALDZAL', code: 'BNA' },
      { name: 'Banque Extérieure d\'Algérie (BEA)', swiftPrefix: 'BEXADZAL', code: 'BEA' },
      { name: 'Crédit Populaire d\'Algérie (CPA)', swiftPrefix: 'CPALDZAL', code: 'CPA' },
      { name: 'Banque de Développement Local (BDL)', swiftPrefix: 'BDALDZAL', code: 'BDL' },
      { name: 'Société Générale Algérie', swiftPrefix: 'SGEADZAL', code: 'SGA' }
    ]
  },
  {
    country: 'Andorra',
    code: 'AD',
    currency: 'EUR',
    banks: [
      { name: 'Andbank (Andorra Banc Agrícol)', swiftPrefix: 'ANDBAD22', code: 'AND' },
      { name: 'MoraBanc', swiftPrefix: 'BMRBAD22', code: 'MBR' },
      { name: 'Crèdit Andorrà', swiftPrefix: 'CRENAD22', code: 'CRD' }
    ]
  },
  {
    country: 'Angola',
    code: 'AO',
    currency: 'AOA',
    banks: [
      { name: 'Banco Angolano de Investimentos (BAI)', swiftPrefix: 'BAINAOLU', code: 'BAI' },
      { name: 'Banco de Poupança e Crédito (BPC)', swiftPrefix: 'BPCEAOLU', code: 'BPC' },
      { name: 'Banco de Fomento Angola (BFA)', swiftPrefix: 'BMAOAOLU', code: 'BFA' },
      { name: 'Standard Bank Angola', swiftPrefix: 'SBICAOLU', code: 'SBA' }
    ]
  },
  {
    country: 'Argentina',
    code: 'AR',
    currency: 'ARS',
    banks: [
      { name: 'Banco de la Nación Argentina', swiftPrefix: 'NACNARBA', code: 'BNA' },
      { name: 'Banco Santander Argentina', swiftPrefix: 'BSHAARBA', code: 'SNT' },
      { name: 'Banco Galicia', swiftPrefix: 'GALIARBA', code: 'GAL' },
      { name: 'BBVA Argentina', swiftPrefix: 'BBVAARBA', code: 'BBVA' },
      { name: 'Banco Macro', swiftPrefix: 'BMAUARBA', code: 'MAC' }
    ]
  },
  {
    country: 'Armenia',
    code: 'AM',
    currency: 'AMD',
    banks: [
      { name: 'Ameriabank CJSC', swiftPrefix: 'ARMSAM22', code: 'AMR' },
      { name: 'Ardshinbank CJSC', swiftPrefix: 'ASHBAM22', code: 'ASH' },
      { name: 'Acba Bank OJSC', swiftPrefix: 'AGCAAM22', code: 'ACB' },
      { name: 'Inecobank CJSC', swiftPrefix: 'INECAM22', code: 'INC' }
    ]
  },
  {
    country: 'Australia',
    code: 'AU',
    currency: 'AUD',
    banks: [
      { name: 'Commonwealth Bank of Australia (CBA)', swiftPrefix: 'CTBAAU2S', code: 'CBA' },
      { name: 'Westpac Banking Corporation', swiftPrefix: 'WPACAU2S', code: 'WBC' },
      { name: 'Australia and New Zealand Banking Group (ANZ)', swiftPrefix: 'ANZBAU3M', code: 'ANZ' },
      { name: 'National Australia Bank (NAB)', swiftPrefix: 'NATAAU33', code: 'NAB' },
      { name: 'Macquarie Bank', swiftPrefix: 'MACQAU2S', code: 'MAC' },
      { name: 'Bendigo and Adelaide Bank', swiftPrefix: 'BENDAU3B', code: 'BEN' }
    ]
  },
  {
    country: 'Austria',
    code: 'AT',
    currency: 'EUR',
    banks: [
      { name: 'Erste Group Bank AG', swiftPrefix: 'GIBAATWW', code: 'EGB' },
      { name: 'Raiffeisen Bank International (RBI)', swiftPrefix: 'RZBAATWW', code: 'RBI' },
      { name: 'UniCredit Bank Austria AG', swiftPrefix: 'BKAUATWW', code: 'UBA' },
      { name: 'BAWAG P.S.K.', swiftPrefix: 'BAWAATWW', code: 'BAW' },
      { name: 'Oberbank AG', swiftPrefix: 'OBKLAT2L', code: 'OBK' }
    ]
  },
  {
    country: 'Azerbaijan',
    code: 'AZ',
    currency: 'AZN',
    banks: [
      { name: 'International Bank of Azerbaijan (ABB)', swiftPrefix: 'IBAZAZ2X', code: 'ABB' },
      { name: 'Kapital Bank OJSC', swiftPrefix: 'AIIBAZ2X', code: 'KAP' },
      { name: 'PASHA Bank OJSC', swiftPrefix: 'PASHAZ22', code: 'PSH' }
    ]
  },
  {
    country: 'Bahamas',
    code: 'BS',
    currency: 'BSD',
    banks: [
      { name: 'FirstCaribbean International Bank (Bahamas)', swiftPrefix: 'FCIBBSNS', code: 'CIBC' },
      { name: 'Scotiabank (Bahamas) Ltd', swiftPrefix: 'NOSCBSNS', code: 'BNS' },
      { name: 'Royal Bank of Canada (Bahamas)', swiftPrefix: 'ROYCBSNS', code: 'RBC' },
      { name: 'Bank of The Bahamas Ltd', swiftPrefix: 'BOFBBSNS', code: 'BOB' }
    ]
  },
  {
    country: 'Bahrain',
    code: 'BH',
    currency: 'BHD',
    banks: [
      { name: 'Ahli United Bank (AUB)', swiftPrefix: 'AUBKBHBM', code: 'AUB' },
      { name: 'National Bank of Bahrain (NBB)', swiftPrefix: 'NBBKBHBM', code: 'NBB' },
      { name: 'Bank of Bahrain and Kuwait (BBK)', swiftPrefix: 'BBKKBHBM', code: 'BBK' },
      { name: 'Arab Banking Corporation (Bank ABC)', swiftPrefix: 'ABCOBHBM', code: 'ABC' }
    ]
  },
  {
    country: 'Bangladesh',
    code: 'BD',
    currency: 'BDT',
    banks: [
      { name: 'Sonali Bank PLC', swiftPrefix: 'BSONBDDH', code: 'SBL' },
      { name: 'Islami Bank Bangladesh PLC', swiftPrefix: 'IBBLBDDH', code: 'IBBL' },
      { name: 'BRAC Bank PLC', swiftPrefix: 'BRAEBDDH', code: 'BRAC' },
      { name: 'Dutch-Bangla Bank PLC', swiftPrefix: 'DBBLBDDH', code: 'DBBL' },
      { name: 'Eastern Bank PLC (EBL)', swiftPrefix: 'EBLNBDDH', code: 'EBL' }
    ]
  },
  {
    country: 'Barbados',
    code: 'BB',
    currency: 'BBD',
    banks: [
      { name: 'FirstCaribbean International Bank Barbados', swiftPrefix: 'FCIBBBBB', code: 'CIBC' },
      { name: 'Republic Bank (Barbados) Ltd', swiftPrefix: 'RBLCBBBB', code: 'RBL' },
      { name: 'Scotiabank Barbados', swiftPrefix: 'NOSCBBBB', code: 'BNS' }
    ]
  },
  {
    country: 'Belgium',
    code: 'BE',
    currency: 'EUR',
    banks: [
      { name: 'BNP Paribas Fortis', swiftPrefix: 'GEBABEBB', code: 'BNP' },
      { name: 'KBC Bank NV', swiftPrefix: 'KREDBEBB', code: 'KBC' },
      { name: 'ING Belgium SA/NV', swiftPrefix: 'BBRUBEBB', code: 'ING' },
      { name: 'Belfius Bank SA', swiftPrefix: 'GKCCBEBB', code: 'BLF' }
    ]
  },
  {
    country: 'Belize',
    code: 'BZ',
    currency: 'BZD',
    banks: [
      { name: 'Belize Bank Limited', swiftPrefix: 'BBBLBZBZ', code: 'BBL' },
      { name: 'Atlantic Bank Ltd', swiftPrefix: 'ATLABZBZ', code: 'ATL' },
      { name: 'National Bank of Belize', swiftPrefix: 'NBOFBZBZ', code: 'NBB' }
    ]
  },
  {
    country: 'Benin',
    code: 'BJ',
    currency: 'XOF',
    banks: [
      { name: 'Bank of Africa Bénin (BOA)', swiftPrefix: 'AFRIBJBJ', code: 'BOA' },
      { name: 'Ecobank Bénin', swiftPrefix: 'ECOCBJBJ', code: 'ECO' },
      { name: 'Société Générale Bénin', swiftPrefix: 'SGEBJBJB', code: 'SGB' }
    ]
  },
  {
    country: 'Bhutan',
    code: 'BT',
    currency: 'BTN',
    banks: [
      { name: 'Bank of Bhutan Ltd', swiftPrefix: 'BOBTLTHU', code: 'BOB' },
      { name: 'Bhutan National Bank Ltd', swiftPrefix: 'BNBLBTTH', code: 'BNB' },
      { name: 'Druk PNB Bank Ltd', swiftPrefix: 'DPNBBTTH', code: 'DPNB' }
    ]
  },
  {
    country: 'Bolivia',
    code: 'BO',
    currency: 'BOB',
    banks: [
      { name: 'Banco Mercantil Santa Cruz', swiftPrefix: 'BMSUBO22', code: 'BMSC' },
      { name: 'Banco Nacional de Bolivia (BNB)', swiftPrefix: 'BNBOPALP', code: 'BNB' },
      { name: 'Banco de Crédito de Bolivia (BCP)', swiftPrefix: 'BCREBO22', code: 'BCP' },
      { name: 'Banco Unión S.A.', swiftPrefix: 'UNINBO22', code: 'BUN' }
    ]
  },
  {
    country: 'Bosnia and Herzegovina',
    code: 'BA',
    currency: 'BAM',
    banks: [
      { name: 'UniCredit Bank d.d. Mostar', swiftPrefix: 'UNCRBA22', code: 'UCB' },
      { name: 'Raiffeisen Bank Bosna i Hercegovina', swiftPrefix: 'RZBABA2S', code: 'RZBA' },
      { name: 'Intesa Sanpaolo Banka BiH', swiftPrefix: 'UPBKBA22', code: 'ISBA' }
    ]
  },
  {
    country: 'Botswana',
    code: 'BW',
    currency: 'BWP',
    banks: [
      { name: 'First National Bank of Botswana (FNBB)', swiftPrefix: 'FIRNBWGX', code: 'FNBB' },
      { name: 'Absa Bank Botswana', swiftPrefix: 'BARCBWGX', code: 'ABSA' },
      { name: 'Stanbic Bank Botswana', swiftPrefix: 'SBICBWGX', code: 'STN' }
    ]
  },
  {
    country: 'Brazil',
    code: 'BR',
    currency: 'BRL',
    banks: [
      { name: 'Itaú Unibanco S.A.', swiftPrefix: 'ITAUUS33', code: 'ITAU' },
      { name: 'Banco do Brasil S.A.', swiftPrefix: 'BRASBRRJ', code: 'BDB' },
      { name: 'Banco Bradesco S.A.', swiftPrefix: 'BBDEBRSP', code: 'BRAD' },
      { name: 'Caixa Econômica Federal', swiftPrefix: 'CEFXBRDF', code: 'CEF' },
      { name: 'Banco Santander Brasil S.A.', swiftPrefix: 'BSBRBRSP', code: 'SNT' },
      { name: 'Banco BTG Pactual S.A.', swiftPrefix: 'BTGPBRRJ', code: 'BTG' }
    ]
  },
  {
    country: 'Brunei',
    code: 'BN',
    currency: 'BND',
    banks: [
      { name: 'Bank Islam Brunei Darussalam (BIBD)', swiftPrefix: 'IBBIBNBS', code: 'BIBD' },
      { name: 'Baiduri Bank Berhad', swiftPrefix: 'BAIDBNBS', code: 'BAI' },
      { name: 'Standard Chartered Bank Brunei', swiftPrefix: 'SCBLBNBS', code: 'SCB' }
    ]
  },
  {
    country: 'Bulgaria',
    code: 'BG',
    currency: 'BGN',
    banks: [
      { name: 'UniCredit Bulbank', swiftPrefix: 'UNCRBGSF', code: 'UCB' },
      { name: 'DSK Bank (OTP Group)', swiftPrefix: 'STSABGSF', code: 'DSK' },
      { name: 'United Bulgarian Bank (UBB/KBC)', swiftPrefix: 'UBBSBGSF', code: 'UBB' },
      { name: 'First Investment Bank (Fibank)', swiftPrefix: 'FINVBGSF', code: 'FIB' }
    ]
  },
  {
    country: 'Cambodia',
    code: 'KH',
    currency: 'KHR',
    banks: [
      { name: 'Canadia Bank PLC', swiftPrefix: 'CADIKHPP', code: 'CAN' },
      { name: 'Advanced Bank of Asia (ABA Bank)', swiftPrefix: 'ABAAKHPP', code: 'ABA' },
      { name: 'ACLEDA Bank PLC', swiftPrefix: 'ACLEKHPP', code: 'ACL' }
    ]
  },
  {
    country: 'Cameroon',
    code: 'CM',
    currency: 'XAF',
    banks: [
      { name: 'Afriland First Bank', swiftPrefix: 'CCCECMC2', code: 'AFB' },
      { name: 'Société Générale Cameroun', swiftPrefix: 'SGECMC2X', code: 'SGC' },
      { name: 'Banque Internationale du Cameroun (BICEC)', swiftPrefix: 'BICECMC2', code: 'BIC' }
    ]
  },
  {
    country: 'Canada',
    code: 'CA',
    currency: 'CAD',
    banks: [
      { name: 'Royal Bank of Canada (RBC)', swiftPrefix: 'ROYCCAT2', code: 'RBC' },
      { name: 'The Toronto-Dominion Bank (TD)', swiftPrefix: 'TDOMCATT', code: 'TD' },
      { name: 'Bank of Nova Scotia (Scotiabank)', swiftPrefix: 'NOSCCATT', code: 'BNS' },
      { name: 'Bank of Montreal (BMO)', swiftPrefix: 'BOFMCAM2', code: 'BMO' },
      { name: 'Canadian Imperial Bank of Commerce (CIBC)', swiftPrefix: 'CIBCATT', code: 'CIBC' },
      { name: 'National Bank of Canada', swiftPrefix: 'BNDCCAMM', code: 'NBC' },
      { name: 'Desjardins Group', swiftPrefix: 'CCQCCAMM', code: 'DES' }
    ]
  },
  {
    country: 'Chile',
    code: 'CL',
    currency: 'CLP',
    banks: [
      { name: 'Banco de Chile', swiftPrefix: 'BCHICLRM', code: 'BCH' },
      { name: 'Banco Santander-Chile', swiftPrefix: 'BSCHCLRM', code: 'SNT' },
      { name: 'Banco del Estado de Chile (BancoEstado)', swiftPrefix: 'BECHCLRM', code: 'BEC' },
      { name: 'Banco de Crédito e Inversiones (Bci)', swiftPrefix: 'BCICCLRM', code: 'BCI' },
      { name: 'Itaú Corpbanca', swiftPrefix: 'ITAICLRM', code: 'ITAU' }
    ]
  },
  {
    country: 'China',
    code: 'CN',
    currency: 'CNY',
    banks: [
      { name: 'Industrial and Commercial Bank of China (ICBC)', swiftPrefix: 'ICBKCNBJ', code: 'ICBC' },
      { name: 'China Construction Bank (CCB)', swiftPrefix: 'PCBCBNBJ', code: 'CCB' },
      { name: 'Agricultural Bank of China (ABC)', swiftPrefix: 'ABOCCNBJ', code: 'ABC' },
      { name: 'Bank of China (BOC)', swiftPrefix: 'BKCHCNBJ', code: 'BOC' },
      { name: 'Bank of Communications (BOCOM)', swiftPrefix: 'COMMCNSH', code: 'BOCOM' },
      { name: 'China Merchants Bank (CMB)', swiftPrefix: 'CMBCCNBS', code: 'CMB' },
      { name: 'Postal Savings Bank of China (PSBC)', swiftPrefix: 'PSBCCNBS', code: 'PSBC' }
    ]
  },
  {
    country: 'Colombia',
    code: 'CO',
    currency: 'COP',
    banks: [
      { name: 'Bancolombia S.A.', swiftPrefix: 'COLBCOBM', code: 'BAN' },
      { name: 'Banco de Bogotá', swiftPrefix: 'BOGOCOBM', code: 'BOG' },
      { name: 'Davivienda', swiftPrefix: 'CAFECOBM', code: 'DAV' },
      { name: 'Banco de Occidente', swiftPrefix: 'OCCICOBM', code: 'OCC' },
      { name: 'BBVA Colombia', swiftPrefix: 'BBVACOBM', code: 'BBVA' }
    ]
  },
  {
    country: 'Costa Rica',
    code: 'CR',
    currency: 'CRC',
    banks: [
      { name: 'Banco Nacional de Costa Rica', swiftPrefix: 'BNCRCRSJ', code: 'BNCR' },
      { name: 'Banco de Costa Rica (BCR)', swiftPrefix: 'BCRACRSJ', code: 'BCR' },
      { name: 'BAC Credomatic Costa Rica', swiftPrefix: 'BMSJCRSJ', code: 'BAC' },
      { name: 'Banco Promerica Costa Rica', swiftPrefix: 'PROPCRSJ', code: 'PRO' }
    ]
  },
  {
    country: 'Croatia',
    code: 'HR',
    currency: 'EUR',
    banks: [
      { name: 'Zagrebačka banka (UniCredit Group)', swiftPrefix: 'ZABAHR2X', code: 'ZABA' },
      { name: 'Privredna banka Zagreb (PBZ / Intesa)', swiftPrefix: 'PBZGHR2X', code: 'PBZ' },
      { name: 'Erste & Steiermärkische Bank d.d.', swiftPrefix: 'ESBCBM2X', code: 'ESB' },
      { name: 'OTP banka d.d.', swiftPrefix: 'OTPVHR2X', code: 'OTP' }
    ]
  },
  {
    country: 'Cyprus',
    code: 'CY',
    currency: 'EUR',
    banks: [
      { name: 'Bank of Cyprus', swiftPrefix: 'BCYPCY2N', code: 'BOC' },
      { name: 'Hellenic Bank Public Company Ltd', swiftPrefix: 'HEBACY2N', code: 'HLB' },
      { name: 'Eurobank Cyprus Ltd', swiftPrefix: 'EURBCY2N', code: 'ERB' }
    ]
  },
  {
    country: 'Czech Republic',
    code: 'CZ',
    currency: 'CZK',
    banks: [
      { name: 'Česká spořitelna (Erste Group)', swiftPrefix: 'GIBACZPX', code: 'CS' },
      { name: 'ČSOB (KBC Group)', swiftPrefix: 'CEKOCZPP', code: 'CSOB' },
      { name: 'Komerční banka (Société Générale)', swiftPrefix: 'KOBACZPP', code: 'KB' },
      { name: 'UniCredit Bank Czech Republic', swiftPrefix: 'BACXCZPP', code: 'UCB' },
      { name: 'Raiffeisenbank a.s.', swiftPrefix: 'RZBCCZPP', code: 'RB' }
    ]
  },
  {
    country: 'Denmark',
    code: 'DK',
    currency: 'DKK',
    banks: [
      { name: 'Danske Bank A/S', swiftPrefix: 'DABADKKK', code: 'DAN' },
      { name: 'Nordea Bank Danmark', swiftPrefix: 'NDEADKKK', code: 'NOR' },
      { name: 'Jyske Bank A/S', swiftPrefix: 'JYBADKKK', code: 'JYS' },
      { name: 'Sydbank A/S', swiftPrefix: 'SYBKDK22', code: 'SYD' },
      { name: 'Nykredit Bank', swiftPrefix: 'NYBRDK21', code: 'NYK' }
    ]
  },
  {
    country: 'Dominican Republic',
    code: 'DO',
    currency: 'DOP',
    banks: [
      { name: 'Banco Popular Dominicano', swiftPrefix: 'BPDODO22', code: 'BPD' },
      { name: 'Banco de Reservas de la República Dominicana', swiftPrefix: 'BRDODO22', code: 'BRD' },
      { name: 'Banco BHD León', swiftPrefix: 'BHDODO22', code: 'BHD' }
    ]
  },
  {
    country: 'Ecuador',
    code: 'EC',
    currency: 'USD',
    banks: [
      { name: 'Banco Pichincha C.A.', swiftPrefix: 'PICHECQX', code: 'PIC' },
      { name: 'Banco Guayaquil', swiftPrefix: 'GUAYEC22', code: 'GYE' },
      { name: 'Produbanco (Grupo Promerica)', swiftPrefix: 'PRODEC22', code: 'PRO' },
      { name: 'Banco del Pacífico', swiftPrefix: 'PACIEC22', code: 'PAC' }
    ]
  },
  {
    country: 'Egypt',
    code: 'EG',
    currency: 'EGP',
    banks: [
      { name: 'National Bank of Egypt (NBE)', swiftPrefix: 'NBEGCXCA', code: 'NBE' },
      { name: 'Banque Misr', swiftPrefix: 'BMISEGCX', code: 'BMS' },
      { name: 'Commercial International Bank (CIB)', swiftPrefix: 'CIBEGCAX', code: 'CIB' },
      { name: 'QNB ALAHLI', swiftPrefix: 'QNBAEGCA', code: 'QNB' },
      { name: 'Banque du Caire', swiftPrefix: 'BCAIEGCX', code: 'BDC' }
    ]
  },
  {
    country: 'Estonia',
    code: 'EE',
    currency: 'EUR',
    banks: [
      { name: 'Swedbank AS', swiftPrefix: 'HABAEE2X', code: 'SWED' },
      { name: 'SEB Pank AS', swiftPrefix: 'EEPUAE2X', code: 'SEB' },
      { name: 'LHV Pank', swiftPrefix: 'LHVBEE22', code: 'LHV' },
      { name: 'Luminor Bank AS', swiftPrefix: 'NDEAEE2X', code: 'LUM' }
    ]
  },
  {
    country: 'Ethiopia',
    code: 'ET',
    currency: 'ETB',
    banks: [
      { name: 'Commercial Bank of Ethiopia (CBE)', swiftPrefix: 'CBETETAA', code: 'CBE' },
      { name: 'Awash International Bank', swiftPrefix: 'AWINETAA', code: 'AWA' },
      { name: 'Dashen Bank SC', swiftPrefix: 'DASHETAA', code: 'DAS' },
      { name: 'Bank of Abyssinia', swiftPrefix: 'ABYSETAA', code: 'ABY' }
    ]
  },
  {
    country: 'Fiji',
    code: 'FJ',
    currency: 'FJD',
    banks: [
      { name: 'ANZ Banking Group Fiji', swiftPrefix: 'ANZBFJFX', code: 'ANZ' },
      { name: 'Westpac Banking Corporation Fiji', swiftPrefix: 'WPACFJFX', code: 'WBC' },
      { name: 'Bank of South Pacific Fiji (BSP)', swiftPrefix: 'BOSPFJFX', code: 'BSP' }
    ]
  },
  {
    country: 'Finland',
    code: 'FI',
    currency: 'EUR',
    banks: [
      { name: 'Nordea Bank Abp', swiftPrefix: 'NDEAFIII', code: 'NOR' },
      { name: 'OP Financial Group', swiftPrefix: 'OKOYFIHH', code: 'OP' },
      { name: 'Danske Bank Finland', swiftPrefix: 'DABAFIHH', code: 'DAN' },
      { name: 'Aktia Bank plc', swiftPrefix: 'AKTIFFHH', code: 'AKT' },
      { name: 'S-Pankki Oy', swiftPrefix: 'SOCOFIHH', code: 'SBK' }
    ]
  },
  {
    country: 'France',
    code: 'FR',
    currency: 'EUR',
    banks: [
      { name: 'BNP Paribas', swiftPrefix: 'BNPAFRNP', code: 'BNP' },
      { name: 'Crédit Agricole Group', swiftPrefix: 'AGRIFRPP', code: 'ACA' },
      { name: 'Société Générale', swiftPrefix: 'SOGEFRNP', code: 'GLE' },
      { name: 'Groupe BPCE (Banque Populaire / Caisse d\'Epargne)', swiftPrefix: 'CEPAFRPP', code: 'BPCE' },
      { name: 'Crédit Mutuel Alliance Fédérale', swiftPrefix: 'CMCIFR2A', code: 'CM' },
      { name: 'La Banque Postale', swiftPrefix: 'POSBFR22', code: 'LBP' }
    ]
  },
  {
    country: 'Georgia',
    code: 'GE',
    currency: 'GEL',
    banks: [
      { name: 'Bank of Georgia', swiftPrefix: 'BAGAGE22', code: 'BOG' },
      { name: 'TBC Bank', swiftPrefix: 'TBCBGE22', code: 'TBC' },
      { name: 'Liberty Bank JSC', swiftPrefix: 'AGBKGE22', code: 'LIB' }
    ]
  },
  {
    country: 'Germany',
    code: 'DE',
    currency: 'EUR',
    banks: [
      { name: 'Deutsche Bank AG', swiftPrefix: 'DEUTDEDM', code: 'DB' },
      { name: 'Commerzbank AG', swiftPrefix: 'COBADEFF', code: 'CBK' },
      { name: 'KfW Bankengruppe', swiftPrefix: 'KFWDDEFF', code: 'KFW' },
      { name: 'DZ BANK AG', swiftPrefix: 'GENODEDF', code: 'DZB' },
      { name: 'Bayerische Landesbank (BayernLB)', swiftPrefix: 'BYLADEMM', code: 'BLB' },
      { name: 'Landesbank Baden-Württemberg (LBBW)', swiftPrefix: 'SOLADEST', code: 'LBBW' },
      { name: 'ING-DiBa AG', swiftPrefix: 'INGDDEFF', code: 'ING' }
    ]
  },
  {
    country: 'Ghana',
    code: 'GH',
    currency: 'GHS',
    banks: [
      { name: 'GCB Bank PLC', swiftPrefix: 'GCBLGHAC', code: 'GCB' },
      { name: 'Ecobank Ghana PLC', swiftPrefix: 'ECOCGHAC', code: 'ECO' },
      { name: 'Stanbic Bank Ghana Ltd', swiftPrefix: 'SBICGHAC', code: 'STN' },
      { name: 'Standard Chartered Bank Ghana', swiftPrefix: 'SCBLGHAC', code: 'SCB' },
      { name: 'Absa Bank Ghana Ltd', swiftPrefix: 'BARCGHAC', code: 'ABSA' },
      { name: 'Fidelity Bank Ghana', swiftPrefix: 'FDBLGHAC', code: 'FID' }
    ]
  },
  {
    country: 'Greece',
    code: 'GR',
    currency: 'EUR',
    banks: [
      { name: 'National Bank of Greece (NBG)', swiftPrefix: 'ETHNGRAA', code: 'NBG' },
      { name: 'Piraeus Bank', swiftPrefix: 'PIRBGRAA', code: 'PIR' },
      { name: 'Eurobank S.A.', swiftPrefix: 'EURBGRAA', code: 'ERB' },
      { name: 'Alpha Bank S.A.', swiftPrefix: 'CRBAGRAA', code: 'ALP' }
    ]
  },
  {
    country: 'Guatemala',
    code: 'GT',
    currency: 'GTQ',
    banks: [
      { name: 'Banco Industrial S.A.', swiftPrefix: 'BINDGTGC', code: 'BI' },
      { name: 'Banco G&T Continental', swiftPrefix: 'GTCBGTGC', code: 'GTC' },
      { name: 'Banrural (Banco de Desarrollo Rural)', swiftPrefix: 'RURLGTGC', code: 'BAN' }
    ]
  },
  {
    country: 'Honduras',
    code: 'HN',
    currency: 'HNL',
    banks: [
      { name: 'Banco Atlántida S.A.', swiftPrefix: 'ATLAHNTE', code: 'ATL' },
      { name: 'Banco Ficohsa', swiftPrefix: 'FICHHNTE', code: 'FIC' },
      { name: 'Banco de Occidente S.A.', swiftPrefix: 'OCCIHNTE', code: 'OCC' }
    ]
  },
  {
    country: 'Hong Kong',
    code: 'HK',
    currency: 'HKD',
    banks: [
      { name: 'The Hongkong and Shanghai Banking Corporation (HSBC)', swiftPrefix: 'HSBCHKHH', code: 'HSBC' },
      { name: 'Bank of China (Hong Kong)', swiftPrefix: 'BKCHHKHH', code: 'BOCHK' },
      { name: 'Hang Seng Bank Ltd', swiftPrefix: 'HASEHKHH', code: 'HSB' },
      { name: 'Standard Chartered Bank (Hong Kong)', swiftPrefix: 'SCBLHKHH', code: 'SCB' },
      { name: 'Bank of East Asia (BEA)', swiftPrefix: 'BEASHKHH', code: 'BEA' },
      { name: 'DBS Bank (Hong Kong)', swiftPrefix: 'DBSSHKHH', code: 'DBS' }
    ]
  },
  {
    country: 'Hungary',
    code: 'HU',
    currency: 'HUF',
    banks: [
      { name: 'OTP Bank Nyrt.', swiftPrefix: 'OTPVHUHB', code: 'OTP' },
      { name: 'MBH Bank Nyrt.', swiftPrefix: 'MKKBHUHB', code: 'MBH' },
      { name: 'K&H Bank (KBC Group)', swiftPrefix: 'OKHBHUHB', code: 'KH' },
      { name: 'Erste Bank Hungary', swiftPrefix: 'GIBAHUHB', code: 'EBH' },
      { name: 'Raiffeisen Bank Zrt.', swiftPrefix: 'RZBAHUHB', code: 'RZBA' }
    ]
  },
  {
    country: 'Iceland',
    code: 'IS',
    currency: 'ISK',
    banks: [
      { name: 'Landsbankinn hf.', swiftPrefix: 'LAISISRE', code: 'LAN' },
      { name: 'Íslandsbanki hf.', swiftPrefix: 'ISBAISRE', code: 'ISB' },
      { name: 'Arion banki hf.', swiftPrefix: 'ARIONISRE', code: 'ARI' }
    ]
  },
  {
    country: 'India',
    code: 'IN',
    currency: 'INR',
    banks: [
      { name: 'State Bank of India (SBI)', swiftPrefix: 'SBININBB', code: 'SBI' },
      { name: 'HDFC Bank Ltd', swiftPrefix: 'HDFCINBB', code: 'HDFC' },
      { name: 'ICICI Bank Ltd', swiftPrefix: 'ICICINBB', code: 'ICICI' },
      { name: 'Axis Bank Ltd', swiftPrefix: 'UTIBINBB', code: 'AXIS' },
      { name: 'Kotak Mahindra Bank', swiftPrefix: 'KKBKINBB', code: 'KOTAK' },
      { name: 'Punjab National Bank (PNB)', swiftPrefix: 'PUNBINBB', code: 'PNB' },
      { name: 'Bank of Baroda', swiftPrefix: 'BARBINBB', code: 'BOB' }
    ]
  },
  {
    country: 'Indonesia',
    code: 'ID',
    currency: 'IDR',
    banks: [
      { name: 'Bank Mandiri (Persero) Tbk', swiftPrefix: 'BMRIIDJA', code: 'MDR' },
      { name: 'Bank Rakyat Indonesia (BRI)', swiftPrefix: 'BRINIDJA', code: 'BRI' },
      { name: 'Bank Central Asia (BCA)', swiftPrefix: 'CENAIDJA', code: 'BCA' },
      { name: 'Bank Negara Indonesia (BNI)', swiftPrefix: 'BNINIDJA', code: 'BNI' },
      { name: 'Bank CIMB Niaga', swiftPrefix: 'BNIAIDJA', code: 'CIMB' }
    ]
  },
  {
    country: 'Iraq',
    code: 'IQ',
    currency: 'IQD',
    banks: [
      { name: 'Trade Bank of Iraq (TBI)', swiftPrefix: 'TRIQIQBA', code: 'TBI' },
      { name: 'Rafidain Bank', swiftPrefix: 'RAFBIQBA', code: 'RAF' },
      { name: 'Rasheed Bank', swiftPrefix: 'RASHIQBA', code: 'RSH' },
      { name: 'Bank of Baghdad', swiftPrefix: 'BOGHIQBA', code: 'BOB' }
    ]
  },
  {
    country: 'Ireland',
    code: 'IE',
    currency: 'EUR',
    banks: [
      { name: 'Bank of Ireland (BOI)', swiftPrefix: 'BOFIIE2D', code: 'BOI' },
      { name: 'Allied Irish Banks (AIB)', swiftPrefix: 'AIBKIE2D', code: 'AIB' },
      { name: 'permanent tsb plc', swiftPrefix: 'IPBSIEDD', code: 'PTSB' }
    ]
  },
  {
    country: 'Israel',
    code: 'IL',
    currency: 'ILS',
    banks: [
      { name: 'Bank Hapoalim B.M.', swiftPrefix: 'POALILIT', code: 'HAP' },
      { name: 'Bank Leumi Le-Israel', swiftPrefix: 'LUMIILIT', code: 'LEUMI' },
      { name: 'Israel Discount Bank', swiftPrefix: 'DSCTILIT', code: 'IDB' },
      { name: 'Mizrahi Tefahot Bank', swiftPrefix: 'MIZRILIT', code: 'MIZ' }
    ]
  },
  {
    country: 'Italy',
    code: 'IT',
    currency: 'EUR',
    banks: [
      { name: 'Intesa Sanpaolo S.p.A.', swiftPrefix: 'BCITITMM', code: 'ISP' },
      { name: 'UniCredit S.p.A.', swiftPrefix: 'UNCRITM1', code: 'UCG' },
      { name: 'Banco BPM S.p.A.', swiftPrefix: 'BAPPIT21', code: 'BPM' },
      { name: 'Banca Monte dei Paschi di Siena (BMPS)', swiftPrefix: 'PASCITM1', code: 'MPS' },
      { name: 'BPER Banca S.p.A.', swiftPrefix: 'BPEFIT22', code: 'BPER' },
      { name: 'Mediobanca S.p.A.', swiftPrefix: 'MEBIITMM', code: 'MB' }
    ]
  },
  {
    country: 'Jamaica',
    code: 'JM',
    currency: 'JMD',
    banks: [
      { name: 'National Commercial Bank Jamaica (NCB)', swiftPrefix: 'JNCBJMKN', code: 'NCB' },
      { name: 'Scotiabank Jamaica', swiftPrefix: 'NOSCJMKN', code: 'BNS' },
      { name: 'First Global Bank Ltd', swiftPrefix: 'FGBKJMKN', code: 'FGB' }
    ]
  },
  {
    country: 'Japan',
    code: 'JP',
    currency: 'JPY',
    banks: [
      { name: 'MUFG Bank, Ltd. (Mitsubishi UFJ)', swiftPrefix: 'BOTKJPJT', code: 'MUFG' },
      { name: 'Sumitomo Mitsui Banking Corporation (SMBC)', swiftPrefix: 'SMBCJPJT', code: 'SMBC' },
      { name: 'Mizuho Bank, Ltd.', swiftPrefix: 'MHCBJPJT', code: 'MIZ' },
      { name: 'Japan Post Bank Co., Ltd.', swiftPrefix: 'JPPSJPJ1', code: 'JPB' },
      { name: 'Resona Bank, Limited', swiftPrefix: 'DIWAJPJT', code: 'RES' },
      { name: 'Sumitomo Mitsui Trust Bank', swiftPrefix: 'STBCJPJT', code: 'SMTB' }
    ]
  },
  {
    country: 'Jordan',
    code: 'JO',
    currency: 'JOD',
    banks: [
      { name: 'Arab Bank PLC', swiftPrefix: 'ARABJOAM', code: 'ARAB' },
      { name: 'The Housing Bank for Trade and Finance (HBTF)', swiftPrefix: 'HBTFJOAM', code: 'HBTF' },
      { name: 'Jordan Kuwait Bank', swiftPrefix: 'JKBJOAM', code: 'JKB' }
    ]
  },
  {
    country: 'Kazakhstan',
    code: 'KZ',
    currency: 'KZT',
    banks: [
      { name: 'Halyk Bank (JSC Halyk Bank)', swiftPrefix: 'HSBKKZKX', code: 'HLK' },
      { name: 'Kaspi Bank JSC', swiftPrefix: 'CASPKZKA', code: 'KAS' },
      { name: 'Bank CenterCredit (BCC)', swiftPrefix: 'CCBKKZKA', code: 'BCC' },
      { name: 'ForteBank JSC', swiftPrefix: 'IRTYKZKA', code: 'FRT' }
    ]
  },
  {
    country: 'Kenya',
    code: 'KE',
    currency: 'KES',
    banks: [
      { name: 'KCB Bank Kenya Ltd', swiftPrefix: 'KCBLKENX', code: 'KCB' },
      { name: 'Equity Bank Kenya Ltd', swiftPrefix: 'EQBLKENA', code: 'EQB' },
      { name: 'Co-operative Bank of Kenya', swiftPrefix: 'KCOOENA', code: 'COOP' },
      { name: 'Standard Chartered Bank Kenya', swiftPrefix: 'SCBLKENX', code: 'SCB' },
      { name: 'Absa Bank Kenya PLC', swiftPrefix: 'BARCKENX', code: 'ABSA' },
      { name: 'NCBA Bank Kenya PLC', swiftPrefix: 'NCBAKENA', code: 'NCBA' }
    ]
  },
  {
    country: 'Kuwait',
    code: 'KW',
    currency: 'KWD',
    banks: [
      { name: 'National Bank of Kuwait (NBK)', swiftPrefix: 'NBOKKWKW', code: 'NBK' },
      { name: 'Kuwait Finance House (KFH)', swiftPrefix: 'KFHUKWKW', code: 'KFH' },
      { name: 'Gulf Bank Kuwait', swiftPrefix: 'GULFKWKW', code: 'GBK' },
      { name: 'Burgan Bank', swiftPrefix: 'BURGKWKW', code: 'BUR' },
      { name: 'Commercial Bank of Kuwait (CBK)', swiftPrefix: 'CBOKKWKW', code: 'CBK' }
    ]
  },
  {
    country: 'Latvia',
    code: 'LV',
    currency: 'EUR',
    banks: [
      { name: 'Swedbank AS Latvia', swiftPrefix: 'HABALV22', code: 'SWED' },
      { name: 'SEB banka AS', swiftPrefix: 'UNLALV2X', code: 'SEB' },
      { name: 'Citadele banka AS', swiftPrefix: 'PARXLL22', code: 'CIT' },
      { name: 'Luminor Bank AS Latvian Branch', swiftPrefix: 'RIBRLL2X', code: 'LUM' }
    ]
  },
  {
    country: 'Lebanon',
    code: 'LB',
    currency: 'LBP',
    banks: [
      { name: 'Bank Audi SAL', swiftPrefix: 'AUDBLBBX', code: 'AUD' },
      { name: 'BLOM Bank SAL', swiftPrefix: 'BLOMBLBX', code: 'BLM' },
      { name: 'Byblos Bank SAL', swiftPrefix: 'BYBALBBX', code: 'BYB' }
    ]
  },
  {
    country: 'Lithuania',
    code: 'LT',
    currency: 'EUR',
    banks: [
      { name: 'Swedbank AB Lithuania', swiftPrefix: 'HABALT22', code: 'SWED' },
      { name: 'SEB bankas AB', swiftPrefix: 'CBVILT2X', code: 'SEB' },
      { name: 'Luminor Bank AS Lithuanian Branch', swiftPrefix: 'AGBLLT2X', code: 'LUM' },
      { name: 'Šiaulių bankas AB', swiftPrefix: 'SAULILT2', code: 'SIA' }
    ]
  },
  {
    country: 'Luxembourg',
    code: 'LU',
    currency: 'EUR',
    banks: [
      { name: 'Banque et Caisse d\'Epargne de l\'Etat (BCEE / Spuerkeess)', swiftPrefix: 'BCEELULL', code: 'BCEE' },
      { name: 'BGL BNP Paribas', swiftPrefix: 'BGLULULL', code: 'BGL' },
      { name: 'Banque Internationale à Luxembourg (BIL)', swiftPrefix: 'BILLLULL', code: 'BIL' },
      { name: 'Banque de Luxembourg', swiftPrefix: 'BLUXLULL', code: 'BLUX' }
    ]
  },
  {
    country: 'Malaysia',
    code: 'MY',
    currency: 'MYR',
    banks: [
      { name: 'Malayan Banking Berhad (Maybank)', swiftPrefix: 'MBBEMYKL', code: 'MAY' },
      { name: 'CIMB Bank Berhad', swiftPrefix: 'CIBBMYKL', code: 'CIMB' },
      { name: 'Public Bank Berhad', swiftPrefix: 'PBBEMYKL', code: 'PBB' },
      { name: 'RHB Bank Berhad', swiftPrefix: 'RHBBMYKL', code: 'RHB' },
      { name: 'Hong Leong Bank Berhad', swiftPrefix: 'HLBBMYKL', code: 'HLB' },
      { name: 'AmBank (M) Berhad', swiftPrefix: 'ARMYKL', code: 'AMB' }
    ]
  },
  {
    country: 'Malta',
    code: 'MT',
    currency: 'EUR',
    banks: [
      { name: 'Bank of Valletta plc (BOV)', swiftPrefix: 'BOVMMTMT', code: 'BOV' },
      { name: 'HSBC Bank Malta p.l.c.', swiftPrefix: 'MMEBMTMT', code: 'HSBC' },
      { name: 'APS Bank plc', swiftPrefix: 'APSBMTMT', code: 'APS' }
    ]
  },
  {
    country: 'Mauritius',
    code: 'MU',
    currency: 'MUR',
    banks: [
      { name: 'Mauritius Commercial Bank (MCB)', swiftPrefix: 'MCBLMUMU', code: 'MCB' },
      { name: 'State Bank of Mauritius (SBM)', swiftPrefix: 'STCBMUMU', code: 'SBM' },
      { name: 'Absa Bank Mauritius Ltd', swiftPrefix: 'BARCMUMU', code: 'ABSA' }
    ]
  },
  {
    country: 'Mexico',
    code: 'MX',
    currency: 'MXN',
    banks: [
      { name: 'BBVA México, S.A.', swiftPrefix: 'BCMRMXMM', code: 'BBVA' },
      { name: 'Banco Santander México, S.A.', swiftPrefix: 'BSMXMXMM', code: 'SNT' },
      { name: 'Citibanamex (Banco Nacional de México)', swiftPrefix: 'BNMXMXMM', code: 'BNM' },
      { name: 'Banorte (Banco Mercantil del Norte)', swiftPrefix: 'BMNOMXMM', code: 'BNO' },
      { name: 'HSBC México, S.A.', swiftPrefix: 'HSBCMXMM', code: 'HSBC' },
      { name: 'Scotiabank Inverlat, S.A.', swiftPrefix: 'INLOMXMM', code: 'BNS' },
      { name: 'Banco Inbursa, S.A.', swiftPrefix: 'INBUMXMM', code: 'INB' }
    ]
  },
  {
    country: 'Monaco',
    code: 'MC',
    currency: 'EUR',
    banks: [
      { name: 'Compagnie Monégasque de Banque (CMB)', swiftPrefix: 'CMBMMCMM', code: 'CMB' },
      { name: 'CFM Indosuez Wealth Management', swiftPrefix: 'CFMMMCMM', code: 'CFM' },
      { name: 'Banque Julius Baer (Monaco)', swiftPrefix: 'BAERMCMM', code: 'JB' }
    ]
  },
  {
    country: 'Morocco',
    code: 'MA',
    currency: 'MAD',
    banks: [
      { name: 'Attijariwafa Bank', swiftPrefix: 'BCMAMAMC', code: 'AWB' },
      { name: 'Banque Centrale Populaire (BCP)', swiftPrefix: 'BCPOMAMC', code: 'BCP' },
      { name: 'Bank of Africa (BMCE Group)', swiftPrefix: 'BMCEMAMC', code: 'BOA' },
      { name: 'Société Générale Maroc', swiftPrefix: 'SGMBMAMC', code: 'SGM' },
      { name: 'BMCI (BNP Paribas Group)', swiftPrefix: 'BMCIMAMC', code: 'BMCI' }
    ]
  },
  {
    country: 'Netherlands',
    code: 'NL',
    currency: 'EUR',
    banks: [
      { name: 'ING Bank N.V.', swiftPrefix: 'INGBNL2A', code: 'ING' },
      { name: 'Coöperatieve Rabobank U.A.', swiftPrefix: 'RABONL2U', code: 'RABO' },
      { name: 'ABN AMRO Bank N.V.', swiftPrefix: 'ABNANL2A', code: 'ABN' },
      { name: 'de Volksbank N.V.', swiftPrefix: 'SNSBNL2A', code: 'VLB' },
      { name: 'Triodos Bank N.V.', swiftPrefix: 'TRIONL2U', code: 'TRI' }
    ]
  },
  {
    country: 'New Zealand',
    code: 'NZ',
    currency: 'NZD',
    banks: [
      { name: 'ANZ Bank New Zealand Ltd', swiftPrefix: 'ANZBNZ22', code: 'ANZ' },
      { name: 'ASB Bank Ltd (Commonwealth Bank Group)', swiftPrefix: 'ASBBNZ2A', code: 'ASB' },
      { name: 'Bank of New Zealand (BNZ)', swiftPrefix: 'BKNZNZ22', code: 'BNZ' },
      { name: 'Westpac New Zealand Ltd', swiftPrefix: 'WPACNZ2W', code: 'WBC' },
      { name: 'Kiwibank Limited', swiftPrefix: 'CITINZ2X', code: 'KIWI' }
    ]
  },
  {
    country: 'Nigeria',
    code: 'NG',
    currency: 'NGN',
    banks: [
      { name: 'Zenith Bank PLC', swiftPrefix: 'ZEIBNGLA', code: 'ZIB' },
      { name: 'Access Bank PLC', swiftPrefix: 'ACENNGRL', code: 'ACC' },
      { name: 'Guaranty Trust Bank (GTBank / GTCO)', swiftPrefix: 'GTBINGLA', code: 'GTB' },
      { name: 'United Bank for Africa (UBA)', swiftPrefix: 'UNAFNGLA', code: 'UBA' },
      { name: 'First Bank of Nigeria (FBN)', swiftPrefix: 'FBNINGLA', code: 'FBN' },
      { name: 'Fidelity Bank PLC', swiftPrefix: 'FIDBNGLA', code: 'FID' },
      { name: 'Stanbic IBTC Bank PLC', swiftPrefix: 'SBICNGLX', code: 'STN' },
      { name: 'Union Bank of Nigeria PLC', swiftPrefix: 'UBNINGLA', code: 'UBN' },
      { name: 'Sterling Bank PLC', swiftPrefix: 'STBINGLA', code: 'STR' },
      { name: 'Wema Bank PLC', swiftPrefix: 'WEMANGLA', code: 'WEM' }
    ]
  },
  {
    country: 'Norway',
    code: 'NO',
    currency: 'NOK',
    banks: [
      { name: 'DNB Bank ASA', swiftPrefix: 'DNBNNOKK', code: 'DNB' },
      { name: 'Nordea Bank Abp, filial i Norge', swiftPrefix: 'NDEANOKK', code: 'NOR' },
      { name: 'SpareBank 1 SR-Bank ASA', swiftPrefix: 'ROGSNO22', code: 'SP1' },
      { name: 'Handelsbanken Norge', swiftPrefix: 'HANDNOKK', code: 'HAN' },
      { name: 'Storebrand Bank ASA', swiftPrefix: 'STOBNO22', code: 'STO' }
    ]
  },
  {
    country: 'Oman',
    code: 'OM',
    currency: 'OMR',
    banks: [
      { name: 'Bank Muscat S.A.O.G.', swiftPrefix: 'BMUSOMMC', code: 'MUS' },
      { name: 'Bank Dhofar S.A.O.G.', swiftPrefix: 'BDOFOMMC', code: 'DHO' },
      { name: 'National Bank of Oman (NBO)', swiftPrefix: 'NBOMOMMC', code: 'NBO' },
      { name: 'Sohar International Bank', swiftPrefix: 'BSOHOMMC', code: 'SOH' }
    ]
  },
  {
    country: 'Pakistan',
    code: 'PK',
    currency: 'PKR',
    banks: [
      { name: 'Habib Bank Limited (HBL)', swiftPrefix: 'HABBABKI', code: 'HBL' },
      { name: 'National Bank of Pakistan (NBP)', swiftPrefix: 'NBPAPKKI', code: 'NBP' },
      { name: 'United Bank Limited (UBL)', swiftPrefix: 'UNILPKKA', code: 'UBL' },
      { name: 'MCB Bank Limited', swiftPrefix: 'MUCBPKKA', code: 'MCB' },
      { name: 'Meezan Bank Limited', swiftPrefix: 'MEZNPKKA', code: 'MEZ' },
      { name: 'Allied Bank Limited (ABL)', swiftPrefix: 'ABLPKKA', code: 'ABL' }
    ]
  },
  {
    country: 'Panama',
    code: 'PA',
    currency: 'PAB',
    banks: [
      { name: 'Banco General, S.A.', swiftPrefix: 'BGENPAPA', code: 'BGEN' },
      { name: 'Banistmo S.A. (Bancolombia)', swiftPrefix: 'BISTPAPA', code: 'BIST' },
      { name: 'Banco Nacional de Panamá', swiftPrefix: 'BNPAPAPA', code: 'BNP' },
      { name: 'Global Bank Corporation', swiftPrefix: 'GLBKPAPA', code: 'GLB' }
    ]
  },
  {
    country: 'Paraguay',
    code: 'PY',
    currency: 'PYG',
    banks: [
      { name: 'Banco Itaú Paraguay S.A.', swiftPrefix: 'ITAUUS33', code: 'ITAU' },
      { name: 'Banco Continental S.A.E.C.A.', swiftPrefix: 'CONTAYPA', code: 'CON' },
      { name: 'Banco GNB Paraguay S.A.', swiftPrefix: 'GNBPAYPA', code: 'GNB' }
    ]
  },
  {
    country: 'Peru',
    code: 'PE',
    currency: 'PEN',
    banks: [
      { name: 'Banco de Crédito del Perú (BCP)', swiftPrefix: 'BCPLPEPL', code: 'BCP' },
      { name: 'BBVA Perú', swiftPrefix: 'BCONPEPL', code: 'BBVA' },
      { name: 'Scotiabank Perú', swiftPrefix: 'BSUDPEPL', code: 'BNS' },
      { name: 'Interbank (Banco Internacional del Perú)', swiftPrefix: 'BINIPEPL', code: 'IBK' }
    ]
  },
  {
    country: 'Philippines',
    code: 'PH',
    currency: 'PHP',
    banks: [
      { name: 'BDO Unibank, Inc. (Banco de Oro)', swiftPrefix: 'BNORPHMM', code: 'BDO' },
      { name: 'Bank of the Philippine Islands (BPI)', swiftPrefix: 'BOPIPHMM', code: 'BPI' },
      { name: 'Metropolitan Bank and Trust Company (Metrobank)', swiftPrefix: 'MBTCPHMM', code: 'MBT' },
      { name: 'Land Bank of the Philippines', swiftPrefix: 'TLBPPHMM', code: 'LBP' },
      { name: 'Philippine National Bank (PNB)', swiftPrefix: 'PNBMPHMM', code: 'PNB' },
      { name: 'Security Bank Corporation', swiftPrefix: 'SETCPHMM', code: 'SEC' }
    ]
  },
  {
    country: 'Poland',
    code: 'PL',
    currency: 'PLN',
    banks: [
      { name: 'PKO Bank Polski', swiftPrefix: 'BPKOPLPW', code: 'PKO' },
      { name: 'Bank Pekao S.A.', swiftPrefix: 'PKOPPLPW', code: 'PEKAO' },
      { name: 'Santander Bank Polska S.A.', swiftPrefix: 'WBKPLPPW', code: 'SNT' },
      { name: 'mBank S.A.', swiftPrefix: 'BREXPLPW', code: 'MBK' },
      { name: 'ING Bank Śląski S.A.', swiftPrefix: 'INGBPLPW', code: 'ING' },
      { name: 'BNP Paribas Bank Polska', swiftPrefix: 'BNPAPLPX', code: 'BNP' }
    ]
  },
  {
    country: 'Portugal',
    code: 'PT',
    currency: 'EUR',
    banks: [
      { name: 'Caixa Geral de Depósitos (CGD)', swiftPrefix: 'CGDIPTPL', code: 'CGD' },
      { name: 'Millennium BCP (Banco Comercial Português)', swiftPrefix: 'BCOMPTPL', code: 'BCP' },
      { name: 'Novo Banco, S.A.', swiftPrefix: 'BESCPTPL', code: 'NB' },
      { name: 'Banco Santander Totta, S.A.', swiftPrefix: 'TOTAPTPL', code: 'SNT' },
      { name: 'Banco BPI (CaixaBank Group)', swiftPrefix: 'BPIFPTPL', code: 'BPI' }
    ]
  },
  {
    country: 'Qatar',
    code: 'QA',
    currency: 'QAR',
    banks: [
      { name: 'Qatar National Bank (QNB)', swiftPrefix: 'QNBAQAQA', code: 'QNB' },
      { name: 'Qatar Islamic Bank (QIB)', swiftPrefix: 'QISBQAQA', code: 'QIB' },
      { name: 'Commercial Bank of Qatar (CBQ)', swiftPrefix: 'CBQAQAQA', code: 'CBQ' },
      { name: 'Masraf Al Rayan', swiftPrefix: 'ARYNQAQA', code: 'RAYAN' },
      { name: 'Doha Bank', swiftPrefix: 'DOHBQAQA', code: 'DOHA' }
    ]
  },
  {
    country: 'Romania',
    code: 'RO',
    currency: 'RON',
    banks: [
      { name: 'Banca Transilvania', swiftPrefix: 'BTRLRO22', code: 'BT' },
      { name: 'Banca Comercială Română (BCR / Erste)', swiftPrefix: 'RNCBROBU', code: 'BCR' },
      { name: 'BRD – Groupe Société Générale', swiftPrefix: 'BRDEROBU', code: 'BRD' },
      { name: 'Raiffeisen Bank România', swiftPrefix: 'RZBRROBU', code: 'RZBA' },
      { name: 'ING Bank N.V. Bucharest Branch', swiftPrefix: 'INGBROBU', code: 'ING' }
    ]
  },
  {
    country: 'Rwanda',
    code: 'RW',
    currency: 'RWF',
    banks: [
      { name: 'Bank of Kigali PLC (BK)', swiftPrefix: 'BKIGRWRW', code: 'BK' },
      { name: 'I&M Bank (Rwanda) PLC', swiftPrefix: 'BCRWRWRW', code: 'IM' },
      { name: 'Equity Bank Rwanda PLC', swiftPrefix: 'EQBLRWRW', code: 'EQB' },
      { name: 'BPR Bank Rwanda PLC (KCB Group)', swiftPrefix: 'BPRLRWRW', code: 'BPR' }
    ]
  },
  {
    country: 'Saudi Arabia',
    code: 'SA',
    currency: 'SAR',
    banks: [
      { name: 'Saudi National Bank (SNB)', swiftPrefix: 'NCBKSARH', code: 'SNB' },
      { name: 'Al Rajhi Bank', swiftPrefix: 'RJHIARIY', code: 'RAJHI' },
      { name: 'Riyad Bank', swiftPrefix: 'RIBLSARI', code: 'RIYAD' },
      { name: 'Banque Saudi Fransi (BSF)', swiftPrefix: 'BSFRSARI', code: 'BSF' },
      { name: 'Arab National Bank (ANB)', swiftPrefix: 'ARABSARH', code: 'ANB' },
      { name: 'Alinma Bank', swiftPrefix: 'INMASARI', code: 'INMA' },
      { name: 'Saudi Awwal Bank (SAB / HSBC)', swiftPrefix: 'SABBSARI', code: 'SAB' }
    ]
  },
  {
    country: 'Senegal',
    code: 'SN',
    currency: 'XOF',
    banks: [
      { name: 'Société Générale Sénégal', swiftPrefix: 'SGSDSNND', code: 'SGS' },
      { name: 'CBAO Groupe Attijariwafa Bank', swiftPrefix: 'BIAOSNDK', code: 'CBAO' },
      { name: 'Ecobank Sénégal', swiftPrefix: 'ECOCSNDK', code: 'ECO' },
      { name: 'Bank of Africa Sénégal (BOA)', swiftPrefix: 'AFRISNDK', code: 'BOA' }
    ]
  },
  {
    country: 'Serbia',
    code: 'RS',
    currency: 'RSD',
    banks: [
      { name: 'Banca Intesa Beograd', swiftPrefix: 'DBDBRSBG', code: 'BIB' },
      { name: 'OTP banka Srbija a.d.', swiftPrefix: 'OTPVRS22', code: 'OTP' },
      { name: 'UniCredit Bank Srbija a.d.', swiftPrefix: 'BACXRSBG', code: 'UCB' },
      { name: 'NLB Komercijalna banka', swiftPrefix: 'KOBBRSBG', code: 'NLB' }
    ]
  },
  {
    country: 'Singapore',
    code: 'SG',
    currency: 'SGD',
    banks: [
      { name: 'DBS Bank Ltd', swiftPrefix: 'DBSSSGSG', code: 'DBS' },
      { name: 'Oversea-Chinese Banking Corporation (OCBC)', swiftPrefix: 'OCBCSGSG', code: 'OCBC' },
      { name: 'United Overseas Bank (UOB)', swiftPrefix: 'UOVBSGSG', code: 'UOB' },
      { name: 'Standard Chartered Bank (Singapore)', swiftPrefix: 'SCBLSGSG', code: 'SCB' },
      { name: 'Citibank Singapore Ltd', swiftPrefix: 'CITISGSG', code: 'CITI' },
      { name: 'HSBC Singapore', swiftPrefix: 'HSBCSGSG', code: 'HSBC' }
    ]
  },
  {
    country: 'Slovakia',
    code: 'SK',
    currency: 'EUR',
    banks: [
      { name: 'Slovenská sporiteľňa (Erste Group)', swiftPrefix: 'GIBASKBX', code: 'SLSP' },
      { name: 'Všeobecná úverová banka (VÚB / Intesa)', swiftPrefix: 'SUBASKBX', code: 'VUB' },
      { name: 'Tatra banka (Raiffeisen)', swiftPrefix: 'TATRSKBX', code: 'TATRA' },
      { name: 'ČSOB Slovensko (KBC)', swiftPrefix: 'CEKOSKBX', code: 'CSOB' }
    ]
  },
  {
    country: 'Slovenia',
    code: 'SI',
    currency: 'EUR',
    banks: [
      { name: 'Nova Ljubljanska Banka (NLB d.d.)', swiftPrefix: 'LJBASI2X', code: 'NLB' },
      { name: 'Nova KBM d.d. (OTP Group)', swiftPrefix: 'KBMS2X', code: 'NKBM' },
      { name: 'SKB banka d.d. (OTP Group)', swiftPrefix: 'SKBASI2X', code: 'SKB' }
    ]
  },
  {
    country: 'South Africa',
    code: 'ZA',
    currency: 'ZAR',
    banks: [
      { name: 'Standard Bank of South Africa', swiftPrefix: 'SBZAJJ', code: 'SBSA' },
      { name: 'First National Bank (FNB / FirstRand)', swiftPrefix: 'FIRNZAJJ', code: 'FNB' },
      { name: 'Absa Bank Limited', swiftPrefix: 'ABSAZAJJ', code: 'ABSA' },
      { name: 'Nedbank Limited', swiftPrefix: 'NEDSZAJJ', code: 'NED' },
      { name: 'Capitec Bank Limited', swiftPrefix: 'CAPIZAJJ', code: 'CAP' },
      { name: 'Investec Bank Limited', swiftPrefix: 'INVEZAJJ', code: 'INV' }
    ]
  },
  {
    country: 'South Korea',
    code: 'KR',
    currency: 'KRW',
    banks: [
      { name: 'KB Kookmin Bank', swiftPrefix: 'CZNBKRSE', code: 'KB' },
      { name: 'Shinhan Bank', swiftPrefix: 'SHBKKRSE', code: 'SHB' },
      { name: 'Hana Bank (KEB Hana)', swiftPrefix: 'KOEXKRSE', code: 'HANA' },
      { name: 'Woori Bank', swiftPrefix: 'HVBKSE', code: 'WOORI' },
      { name: 'Industrial Bank of Korea (IBK)', swiftPrefix: 'IBKOKRSE', code: 'IBK' },
      { name: 'NongHyup Bank (NH Bank)', swiftPrefix: 'NACFKRSE', code: 'NH' },
      { name: 'Standard Chartered Bank Korea', swiftPrefix: 'SCBLKRSE', code: 'SCB' }
    ]
  },
  {
    country: 'Spain',
    code: 'ES',
    currency: 'EUR',
    banks: [
      { name: 'Banco Santander, S.A.', swiftPrefix: 'BSCHESMM', code: 'SAN' },
      { name: 'Banco Bilbao Vizcaya Argentaria (BBVA)', swiftPrefix: 'BBVAESMM', code: 'BBVA' },
      { name: 'CaixaBank, S.A.', swiftPrefix: 'CAIXESBB', code: 'CABK' },
      { name: 'Banco de Sabadell, S.A.', swiftPrefix: 'BSABESBB', code: 'SAB' },
      { name: 'Bankinter, S.A.', swiftPrefix: 'BKTRESMM', code: 'BKT' },
      { name: 'Unicaja Banco, S.A.', swiftPrefix: 'UNCAESMM', code: 'UNI' }
    ]
  },
  {
    country: 'Sri Lanka',
    code: 'LK',
    currency: 'LKR',
    banks: [
      { name: 'Bank of Ceylon (BOC)', swiftPrefix: 'BCEYLKLX', code: 'BOC' },
      { name: 'Commercial Bank of Ceylon PLC', swiftPrefix: 'CCBLLKLX', code: 'COMB' },
      { name: 'Hatton National Bank PLC (HNB)', swiftPrefix: 'HBLKLKLX', code: 'HNB' },
      { name: 'People\'s Bank Sri Lanka', swiftPrefix: 'PSBKLKLX', code: 'PB' }
    ]
  },
  {
    country: 'Sweden',
    code: 'SE',
    currency: 'SEK',
    banks: [
      { name: 'Skandinaviska Enskilda Banken (SEB)', swiftPrefix: 'ESSEESSX', code: 'SEB' },
      { name: 'Swedbank AB', swiftPrefix: 'SWEDESSX', code: 'SWED' },
      { name: 'Handelsbanken (Svenska Handelsbanken)', swiftPrefix: 'HANDESSX', code: 'SHB' },
      { name: 'Nordea Bank Abp, filial i Sverige', swiftPrefix: 'NDEASESS', code: 'NOR' },
      { name: 'Länsförsäkringar Bank', swiftPrefix: 'LANFES22', code: 'LF' }
    ]
  },
  {
    country: 'Switzerland',
    code: 'CH',
    currency: 'CHF',
    banks: [
      { name: 'UBS Switzerland AG', swiftPrefix: 'UBSWCHZH', code: 'UBS' },
      { name: 'Credit Suisse (UBS Group AG)', swiftPrefix: 'CRESCHZZ', code: 'CS' },
      { name: 'Julius Baer Group Ltd', swiftPrefix: 'BAERCHZZ', code: 'JB' },
      { name: 'Zürcher Kantonalbank (ZKB)', swiftPrefix: 'ZKBKCHZZ', code: 'ZKB' },
      { name: 'Banque Cantonale de Genève (BCGE)', swiftPrefix: 'BCGECHGG', code: 'BCGE' },
      { name: 'Pictet & Cie Group', swiftPrefix: 'PICTCHGG', code: 'PIC' },
      { name: 'Lombard Odier', swiftPrefix: 'LOCNCHGG', code: 'LO' },
      { name: 'Vontobel Holding AG', swiftPrefix: 'VONTCHZZ', code: 'VON' }
    ]
  },
  {
    country: 'Taiwan',
    code: 'TW',
    currency: 'TWD',
    banks: [
      { name: 'Bank of Taiwan', swiftPrefix: 'BKTWTWTP', code: 'BOT' },
      { name: 'CTBC Bank Co., Ltd.', swiftPrefix: 'CTBCTWTP', code: 'CTBC' },
      { name: 'Cathay United Bank', swiftPrefix: 'UWBLTWTP', code: 'CUB' },
      { name: 'Mega International Commercial Bank', swiftPrefix: 'ICBCTWTP', code: 'MEGA' },
      { name: 'Fubon Commercial Bank', swiftPrefix: 'TPBKTWTP', code: 'FUBON' }
    ]
  },
  {
    country: 'Tanzania',
    code: 'TZ',
    currency: 'TZS',
    banks: [
      { name: 'CRDB Bank PLC', swiftPrefix: 'CORUTZTZ', code: 'CRDB' },
      { name: 'NMB Bank PLC (National Microfinance Bank)', swiftPrefix: 'NMBLTZTZ', code: 'NMB' },
      { name: 'Stanbic Bank Tanzania Ltd', swiftPrefix: 'SBICTZTX', code: 'STN' },
      { name: 'Standard Chartered Bank Tanzania', swiftPrefix: 'SCBLTZTX', code: 'SCB' }
    ]
  },
  {
    country: 'Thailand',
    code: 'TH',
    currency: 'THB',
    banks: [
      { name: 'Bangkok Bank Public Company Ltd', swiftPrefix: 'BKKBTHTH', code: 'BBL' },
      { name: 'Kasikornbank Public Company Ltd (KBank)', swiftPrefix: 'KASITHTH', code: 'KBANK' },
      { name: 'Siam Commercial Bank (SCB)', swiftPrefix: 'SICATHTH', code: 'SCB' },
      { name: 'Krungthai Bank Public Company Ltd (KTB)', swiftPrefix: 'KRHTTHTH', code: 'KTB' },
      { name: 'Bank of Ayudhya (Krungsri)', swiftPrefix: 'AYUDTHTH', code: 'BAY' },
      { name: 'TMBThanachart Bank (ttb)', swiftPrefix: 'TMBKTHTH', code: 'TTB' }
    ]
  },
  {
    country: 'Trinidad and Tobago',
    code: 'TT',
    currency: 'TTD',
    banks: [
      { name: 'Republic Bank Limited', swiftPrefix: 'RBLTTTPS', code: 'RBL' },
      { name: 'First Citizens Bank Limited', swiftPrefix: 'FCTTTTPS', code: 'FCB' },
      { name: 'Scotiabank Trinidad and Tobago Ltd', swiftPrefix: 'NOSCTTPS', code: 'BNS' }
    ]
  },
  {
    country: 'Tunisia',
    code: 'TN',
    currency: 'TND',
    banks: [
      { name: 'Banque Internationale Arabe de Tunisie (BIAT)', swiftPrefix: 'BIATTNTN', code: 'BIAT' },
      { name: 'Attijari bank Tunisie', swiftPrefix: 'BSTUTNTN', code: 'ABT' },
      { name: 'Banque Nationale Agricole (BNA)', swiftPrefix: 'BNAGTNTN', code: 'BNA' },
      { name: 'Société Tunisienne de Banque (STB)', swiftPrefix: 'STBKTNTN', code: 'STB' }
    ]
  },
  {
    country: 'Turkey',
    code: 'TR',
    currency: 'TRY',
    banks: [
      { name: 'Ziraat Bankası (Türkiye Cumhuriyeti Ziraat)', swiftPrefix: 'TCZBTR2A', code: 'ZIR' },
      { name: 'Türkiye İş Bankası (İşbank)', swiftPrefix: 'ISBKTRIS', code: 'ISBK' },
      { name: 'Garanti BBVA', swiftPrefix: 'TGBATRYS', code: 'GAR' },
      { name: 'Akbank T.A.Ş.', swiftPrefix: 'AKBKTRIS', code: 'AKB' },
      { name: 'Yapı Kredi (Yapı ve Kredi Bankası)', swiftPrefix: 'YAPITRIS', code: 'YKB' },
      { name: 'Halkbank (Türkiye Halk Bankası)', swiftPrefix: 'TRHBTR2A', code: 'HLK' },
      { name: 'VakıfBank', swiftPrefix: 'TVBATR2A', code: 'VAK' },
      { name: 'QNB Finansbank', swiftPrefix: 'FBNLTRIS', code: 'QNB' }
    ]
  },
  {
    country: 'Uganda',
    code: 'UG',
    currency: 'UGX',
    banks: [
      { name: 'Stanbic Bank Uganda Ltd', swiftPrefix: 'SBICUGKX', code: 'STN' },
      { name: 'Centenary Rural Development Bank', swiftPrefix: 'CERDUGKA', code: 'CER' },
      { name: 'Standard Chartered Bank Uganda', swiftPrefix: 'SCBLUGKX', code: 'SCB' },
      { name: 'Absa Bank Uganda Ltd', swiftPrefix: 'BARCUGKX', code: 'ABSA' },
      { name: 'dfcu Bank Limited', swiftPrefix: 'DFCUUGKA', code: 'DFCU' }
    ]
  },
  {
    country: 'Ukraine',
    code: 'UA',
    currency: 'UAH',
    banks: [
      { name: 'PrivatBank (JSC CB PrivatBank)', swiftPrefix: 'PBBEUAKX', code: 'PB' },
      { name: 'Oschadbank (State Savings Bank of Ukraine)', swiftPrefix: 'OSCHUAKX', code: 'OSCH' },
      { name: 'Raiffeisen Bank Ukraine', swiftPrefix: 'APAZUAKX', code: 'RZBA' },
      { name: 'Sense Bank (formerly Alfa-Bank Ukraine)', swiftPrefix: 'ALFAUAKX', code: 'SNS' },
      { name: 'FUIB (First Ukrainian International Bank)', swiftPrefix: 'FUIBUA2X', code: 'FUIB' }
    ]
  },
  {
    country: 'United Arab Emirates',
    code: 'AE',
    currency: 'AED',
    banks: [
      { name: 'First Abu Dhabi Bank (FAB)', swiftPrefix: 'NBADAEAD', code: 'FAB' },
      { name: 'Emirates NBD Bank PJSC', swiftPrefix: 'EBILAEAD', code: 'ENBD' },
      { name: 'Abu Dhabi Commercial Bank (ADCB)', swiftPrefix: 'ADCBAEAA', code: 'ADCB' },
      { name: 'Dubai Islamic Bank (DIB)', swiftPrefix: 'DUBIAEAD', code: 'DIB' },
      { name: 'Mashreq Bank PSC', swiftPrefix: 'BOMLAEAD', code: 'MSHQ' },
      { name: 'Abu Dhabi Islamic Bank (ADIB)', swiftPrefix: 'ADIBBBAE', code: 'ADIB' },
      { name: 'Commercial Bank of Dubai (CBD)', swiftPrefix: 'CBDIAEAD', code: 'CBD' },
      { name: 'RAKBANK (National Bank of Ras Al Khaimah)', swiftPrefix: 'NBOBAEAD', code: 'RAK' }
    ]
  },
  {
    country: 'United Kingdom',
    code: 'GB',
    currency: 'GBP',
    banks: [
      { name: 'Barclays Bank UK PLC', swiftPrefix: 'BARCGB22', code: 'BARC' },
      { name: 'HSBC UK Bank plc', swiftPrefix: 'HBUKGB41', code: 'HSBC' },
      { name: 'Lloyds Bank Plc', swiftPrefix: 'LOYDGB2L', code: 'LOYD' },
      { name: 'National Westminster Bank (NatWest)', swiftPrefix: 'NWBKGB2L', code: 'NWBK' },
      { name: 'Standard Chartered Bank', swiftPrefix: 'SCBLGB2L', code: 'SCBL' },
      { name: 'Santander UK plc', swiftPrefix: 'ABBYGB2L', code: 'SNT' },
      { name: 'Bank of Scotland plc', swiftPrefix: 'BOFSGB2S', code: 'BOS' },
      { name: 'Royal Bank of Scotland (RBS)', swiftPrefix: 'RBOSGB2L', code: 'RBS' },
      { name: 'Virgin Money UK', swiftPrefix: 'NORSGB2N', code: 'VM' }
    ]
  },
  {
    country: 'United States',
    code: 'US',
    currency: 'USD',
    banks: [
      { name: 'Wells Fargo Bank, N.A.', swiftPrefix: 'WFBIUS6S', code: 'WFB' },
      { name: 'JPMorgan Chase Bank, N.A.', swiftPrefix: 'CHASUS33', code: 'JPMC' },
      { name: 'Bank of America, N.A.', swiftPrefix: 'BOFAUS3N', code: 'BOFA' },
      { name: 'Citibank, N.A.', swiftPrefix: 'CITIUS33', code: 'CITI' },
      { name: 'Goldman Sachs Bank USA', swiftPrefix: 'GSCOUS33', code: 'GS' },
      { name: 'Morgan Stanley Bank, N.A.', swiftPrefix: 'MSNYUS33', code: 'MS' },
      { name: 'U.S. Bank National Association', swiftPrefix: 'USBKUS44', code: 'USB' },
      { name: 'PNC Bank, National Association', swiftPrefix: 'PNCCUS33', code: 'PNC' },
      { name: 'Truist Bank', swiftPrefix: 'SNTRUS3A', code: 'TRU' },
      { name: 'Capital One, N.A.', swiftPrefix: 'HIBKUS44', code: 'CAP1' },
      { name: 'The Bank of New York Mellon (BNY)', swiftPrefix: 'IRVTUS3N', code: 'BNY' },
      { name: 'State Street Bank and Trust Company', swiftPrefix: 'SBOSUS33', code: 'STT' }
    ]
  },
  {
    country: 'Uruguay',
    code: 'UY',
    currency: 'UYU',
    banks: [
      { name: 'Banco de la República Oriental del Uruguay (BROU)', swiftPrefix: 'BROUUYMM', code: 'BROU' },
      { name: 'Banco Santander Uruguay', swiftPrefix: 'BSCHUYMM', code: 'SNT' },
      { name: 'Banco Itaú Uruguay S.A.', swiftPrefix: 'ITAUUS33', code: 'ITAU' },
      { name: 'BBVA Uruguay', swiftPrefix: 'BBVAUYMM', code: 'BBVA' }
    ]
  },
  {
    country: 'Uzbekistan',
    code: 'UZ',
    currency: 'UZS',
    banks: [
      { name: 'National Bank of Uzbekistan (NBU)', swiftPrefix: 'NBFAUZ2X', code: 'NBU' },
      { name: 'SQB (Uzbek Industrial and Construction Bank)', swiftPrefix: 'JSICUZ22', code: 'SQB' },
      { name: 'Ipoteka Bank (OTP Group)', swiftPrefix: 'IPOFUZ22', code: 'IPO' },
      { name: 'Hamkorbank JSCB', swiftPrefix: 'HAMKUZ22', code: 'HMK' }
    ]
  },
  {
    country: 'Venezuela',
    code: 'VE',
    currency: 'VES',
    banks: [
      { name: 'Banco de Venezuela, S.A.', swiftPrefix: 'BVCEVECA', code: 'BDV' },
      { name: 'Banesco Banco Universal, C.A.', swiftPrefix: 'BANEVECA', code: 'BAN' },
      { name: 'Banco Mercantil, C.A.', swiftPrefix: 'BAMRVECA', code: 'MER' },
      { name: 'Banco Provincial (BBVA)', swiftPrefix: 'BPROVECA', code: 'PRO' }
    ]
  },
  {
    country: 'Vietnam',
    code: 'VN',
    currency: 'VND',
    banks: [
      { name: 'Vietcombank (Bank for Foreign Trade of Vietnam)', swiftPrefix: 'BFTVVNVX', code: 'VCB' },
      { name: 'VietinBank (Vietnam Joint Stock Commercial Bank)', swiftPrefix: 'ICBVVNVX', code: 'CTG' },
      { name: 'BIDV (Bank for Investment and Development of Vietnam)', swiftPrefix: 'BIDVVNVX', code: 'BIDV' },
      { name: 'Agribank (Vietnam Bank for Agriculture)', swiftPrefix: 'VBAAVNVX', code: 'AGR' },
      { name: 'Techcombank', swiftPrefix: 'VTCBVNVX', code: 'TCB' },
      { name: 'Military Commercial Joint Stock Bank (MBBank)', swiftPrefix: 'MSCBVNVX', code: 'MB' },
      { name: 'VPBank (Vietnam Prosperous Bank)', swiftPrefix: 'VPBVVNVX', code: 'VPB' }
    ]
  },
  {
    country: 'Zambia',
    code: 'ZM',
    currency: 'ZMW',
    banks: [
      { name: 'Zambia National Commercial Bank (Zanaco)', swiftPrefix: 'ZNCOLULX', code: 'ZAN' },
      { name: 'Stanbic Bank Zambia Limited', swiftPrefix: 'SBICZMLX', code: 'STN' },
      { name: 'Standard Chartered Bank Zambia', swiftPrefix: 'SCBLZMLX', code: 'SCB' },
      { name: 'Absa Bank Zambia PLC', swiftPrefix: 'BARCZMLX', code: 'ABSA' }
    ]
  },
  {
    country: 'Zimbabwe',
    code: 'ZW',
    currency: 'USD',
    banks: [
      { name: 'CBZ Bank Limited', swiftPrefix: 'COBMZWHA', code: 'CBZ' },
      { name: 'Stanbic Bank Zimbabwe Limited', swiftPrefix: 'SBICZWHA', code: 'STN' },
      { name: 'CABS (Central Africa Building Society)', swiftPrefix: 'CABSZWHA', code: 'CABS' },
      { name: 'FBC Bank Limited', swiftPrefix: 'FBCBZWHA', code: 'FBC' }
    ]
  }
];

export const EXCHANGE_RATES_TO_USD: Record<string, number> = {
  USD: 1.0,
  EUR: 1.08,
  GBP: 1.29,
  CAD: 0.74,
  CHF: 1.13,
  JPY: 0.0067,
  AUD: 0.65,
  NZD: 0.61,
  SGD: 0.76,
  HKD: 0.128,
  CNY: 0.138,
  INR: 0.012,
  AED: 0.272,
  SAR: 0.267,
  QAR: 0.275,
  KWD: 3.25,
  BHD: 2.65,
  OMR: 2.60,
  ZAR: 0.055,
  BRL: 0.178,
  MXN: 0.052,
  COP: 0.00025,
  CLP: 0.00105,
  ARS: 0.00102,
  PEN: 0.267,
  NGN: 0.00067,
  GHS: 0.063,
  KES: 0.0077,
  EGP: 0.0205,
  MAD: 0.099,
  TRY: 0.029,
  SEK: 0.096,
  NOK: 0.094,
  DKK: 0.145,
  PLN: 0.252,
  CZK: 0.043,
  HUF: 0.0027,
  RON: 0.217,
  BGN: 0.552,
  THB: 0.028,
  MYR: 0.226,
  IDR: 0.000063,
  PHP: 0.0175,
  VND: 0.000039,
  KRW: 0.00073,
  TWD: 0.031,
  PKR: 0.0036,
  BDT: 0.0083,
  LKR: 0.0033,
  ILS: 0.271,
  UAH: 0.024,
  KZT: 0.0021,
  UGX: 0.00027,
  TZS: 0.00038,
  RWF: 0.00073,
  ZMW: 0.037
};
